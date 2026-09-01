import { JSDOM } from 'jsdom';

/* ------------------------------------------------------------------ */
/* Environment                                                         */
/* ------------------------------------------------------------------ */

const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: 'http://localhost/', pretendToBeVisual: true },
);
const g = globalThis as any;
g.window = dom.window;
g.document = dom.window.document;
Object.defineProperty(g, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
  writable: true,
});
g.HTMLElement = dom.window.HTMLElement;
g.Element = dom.window.Element;
g.Node = dom.window.Node;
g.Event = dom.window.Event;
g.KeyboardEvent = dom.window.KeyboardEvent;
g.MouseEvent = dom.window.MouseEvent;
g.getComputedStyle = dom.window.getComputedStyle;
g.requestAnimationFrame = (cb: FrameRequestCallback) =>
  setTimeout(() => cb(0), 0) as unknown as number;
g.cancelAnimationFrame = (id: number) => clearTimeout(id);
g.IS_REACT_ACT_ENVIRONMENT = true;
dom.window.scrollTo = () => {};
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
dom.window.alert = () => {};

const errors: string[] = [];
const origError = console.error;
console.error = (...args: unknown[]) => {
  errors.push(args.map(String).join(' '));
  origError(...args);
};

const { render, screen, fireEvent, waitFor, within, cleanup } = await import(
  '@testing-library/react'
);
const React = (await import('react')).default;
const App = (await import('../src/App')).default;
const { deriveMap } = await import('../src/engine/advisorEngine');
const { computeValue } = await import('../src/engine/valueModel');
const { DEMO_ASSESSMENT } = await import('../src/data/demoCompany');
const { OPPORTUNITY_SEEDS } = await import('../src/data/opportunities');
const { READINESS_QUESTIONS, SCORED_READINESS_QUESTIONS, REVENUE_BANDS } =
  await import('../src/data/catalogs');

const step = (n: string) => console.log(`\n▸ ${n}`);
const ok = (n: string) => console.log(`  ✓ ${n}`);
const assert = (cond: unknown, msg: string) => {
  if (!cond) throw new Error(`ASSERTION FAILED: ${msg}`);
};

/* ================================================================== */
/* PART 1 — the value model, checked independently of the UI           */
/* ================================================================== */

step('Value model arithmetic');

{
  const seed = OPPORTUNITY_SEEDS[0];
  const d = Object.fromEntries(
    seed.valueModel.drivers.map((x) => [x.id, x.value]),
  ) as Record<string, number>;

  const scope = (d['volume-per-month'] * 12 * d['minutes-per-item']) / 60;
  const saved =
    scope *
    (d['addressable-share'] / 100) *
    (d['time-saving-share'] / 100) *
    (d['adoption-share'] / 100) *
    (1 - d['rework-adjustment'] / 100);
  const point = (saved * d['loaded-hourly-cost']) / 1000;

  const engine = computeValue(seed.valueModel);
  assert(
    Math.round(scope) === engine.annualHoursInScope,
    'hours in scope disagree with an independent calculation',
  );
  assert(
    Math.abs(point - engine.point) < 1e-9,
    'point estimate disagrees with an independent calculation',
  );
  ok('engine matches an independently computed estimate');

  assert(
    engine.range.low % 5 === 0 && engine.range.high % 5 === 0,
    'published range is not rounded to €5K',
  );
  ok('published range rounded to €5K — no false precision');
}

{
  const map = deriveMap(DEMO_ASSESSMENT, {});
  const high = map.opportunities.filter((o) => o.priority === 'HIGH');
  const lo = high.reduce((a, o) => a + o.value.low, 0);
  const hi = high.reduce((a, o) => a + o.value.high, 0);
  assert(
    lo === map.summary.estimatedAnnualValue.low &&
      hi === map.summary.estimatedAnnualValue.high,
    `headline €${map.summary.estimatedAnnualValue.low}–${map.summary.estimatedAnnualValue.high}K does not equal the sum of high-priority opportunities €${lo}–${hi}K`,
  );
  ok(`headline €${lo}K–€${hi}K equals the sum of its parts`);

  for (const w of map.workers) {
    const sources = map.opportunities.filter((o) =>
      w.sourceOpportunityIds.includes(o.id),
    );
    const sl = sources.reduce((a, o) => a + o.value.low, 0);
    assert(
      w.value.low === sl,
      `${w.name} value is not the sum of its source opportunities`,
    );
  }
  ok('every worker value is the sum of its source opportunities');

  assert(
    map.opportunities.every((o) => o.computed.confidence !== ('HIGH' as never)),
    'an estimate claims HIGH confidence',
  );
  ok('no estimate claims high confidence from a questionnaire alone');
}

{
  const base = deriveMap(DEMO_ASSESSMENT, {});
  const adjusted = deriveMap(DEMO_ASSESSMENT, {
    'opp-customer-service': { 'volume-per-month': 2000 },
  });
  assert(
    adjusted.opportunities[0].value.low < base.opportunities[0].value.low,
    'halving the volume did not reduce the opportunity estimate',
  );
  assert(
    adjusted.summary.estimatedAnnualValue.low <
      base.summary.estimatedAnnualValue.low,
    'adjusting a driver did not cascade to the headline total',
  );
  assert(
    adjusted.workers[0].value.low < base.workers[0].value.low,
    'adjusting a driver did not cascade to the worker concept',
  );
  ok('adjusting one assumption cascades to opportunity, worker and headline');
}

step('Readiness model');

{
  const weights = SCORED_READINESS_QUESTIONS.reduce((a, q) => a + q.weight, 0);
  assert(
    Math.abs(weights - 1) < 1e-9,
    `scored readiness weights sum to ${weights}, not 1`,
  );
  ok('scored readiness weights sum to exactly 1');

  const manual = READINESS_QUESTIONS.find((q) => q.key === 'manualWorkload')!;
  assert(
    manual.weight === 0 && manual.opportunitySignal === true,
    'manual workload is still contributing to the readiness score',
  );
  ok('manual work is an opportunity signal, not a readiness factor');

  assert(
    READINESS_QUESTIONS.length === 12,
    `expected 12 readiness dimensions, found ${READINESS_QUESTIONS.length}`,
  );
  ok('twelve readiness dimensions collected');

  const r = deriveMap(DEMO_ASSESSMENT, {}).summary.readiness;
  assert(r.strengths.length === 3 && r.gaps.length === 3, 'missing strengths or gaps');
  assert(r.validateBeforePilot.length > 0, 'no pre-pilot validation items');
  assert(r.nextDiscoveryAction.length > 20, 'no next discovery action');
  ok(`demo readiness ${r.score}/100 — "${r.band}", with gaps and a next action`);
}

step('Data hygiene');

{
  assert(
    !REVENUE_BANDS.includes('€42M'),
    'the demonstration-only exact revenue figure is still offered as an option',
  );
  ok('revenue options are bands only — no demo-specific exact figure');
}

/* ================================================================== */
/* PART 2 — the full journey through the interface                     */
/* ================================================================== */

render(React.createElement(App));

step('Landing');
await screen.findByText('Design Your AI Operating Model');
ok('hero headline preserved');
screen.getAllByText(/starting point for expert validation, not a final business case/);
ok('promise statement visible near the top, not buried in the footer');
screen.getAllByText('Business first. AI second.');
ok('"Business first. AI second." retained');
screen.getAllByText('We are not selling you AI agents.');
screen.getAllByText('An automated business case');
ok('positioning now also rejects "automated business case"');
assert(screen.getAllByText('This tool').length === 2, 'journey rail does not mark scope');
ok('journey rail marks where this tool ends');
screen.getAllByText('Expert validation');
screen.getAllByText('Controlled pilot');
ok('journey rail shows validation and pilot stages');

step('Assessment — demo data');
fireEvent.click(screen.getAllByRole('button', { name: 'Start Your AI Assessment' })[0]);
await screen.findByText('Tell us about your company');
ok('step 1 company');
screen.getAllByText(/Worked example loaded/);
ok('sidebar correctly says the worked example is loaded');

const cont = () => screen.getAllByRole('button', { name: /Continue/ })[0];
fireEvent.click(cont());
await screen.findByText('Tell us about your workforce');
assert(screen.getAllByText('420').length > 0, 'total headcount not 420');
ok('step 2 workforce, total 420');

fireEvent.click(screen.getAllByRole('button', { name: /Add department/ })[0]);
const removeBtns = screen.getAllByRole('button', { name: /^Remove/ });
fireEvent.click(removeBtns[removeBtns.length - 1]);
ok('add and remove a department row');

fireEvent.click(cont());
await screen.findByText('Where does your team spend time?');
fireEvent.click(screen.getAllByRole('checkbox', { name: /Scheduling/ })[0]);
const customInput = screen.getAllByPlaceholderText(/Warranty claim handling/)[0];
fireEvent.change(customInput, { target: { value: 'Warranty claim handling' } });
fireEvent.click(screen.getAllByRole('button', { name: /^Add$/ })[0]);
await screen.findByText('Warranty claim handling');
ok('step 3 operations, toggle and custom entry');

fireEvent.click(cont());
await screen.findByText('What systems do you use?');
fireEvent.click(cont());
await screen.findByText('What are you trying to achieve?');
fireEvent.click(cont());
await screen.findByText('How ready is the ground?');
ok('steps 4–6');

for (const label of ['Operational foundations', 'Data, security and governance', 'Organisation and delivery capacity'])
  screen.getAllByText(label);
ok('readiness grouped into three areas');
screen.getAllByText('Opportunity signal — not scored');
ok('manual work labelled as an opportunity signal in the form');

const scoreText = screen.getAllByText(/\/100/)[0].parentElement?.textContent ?? '';
ok(`live readiness score shown: ${scoreText.trim().replace(/\s+/g, ' ')}`);

step('Analysis');
fireEvent.click(
  screen.getAllByRole('button', { name: /Generate my indicative map/ })[0],
);
await screen.findByText('Building your indicative map');
ok('analysis screen, indicative language');

step('Results');
await screen.findByText('Your AI Transformation Map', {}, { timeout: 15000 });
ok('results dashboard');
screen.getAllByText('Indicative first-pass assessment');
ok('map labelled as an indicative first pass');
screen.getAllByText('Potential AI opportunities indicated');
screen.getAllByText('Provisional AI worker concepts');
screen.getAllByText('Indicative annual value');
ok('summary tiles use indicative / provisional language');
assert(
  screen.queryByText(/Ready to configure in Smooth Operator/) === null,
  '"Ready to configure in Smooth Operator" is still present',
);
assert(
  screen.queryByText(/Ready for a first deployment/) === null,
  '"Ready for a first deployment" is still present',
);
ok('no remaining readiness-to-deploy claims');
assert(
  screen.getAllByText('Indicative').length >= 3,
  'status chips missing from the summary tiles',
);
ok('every headline figure carries a status chip');

step('Readiness breakdown');
screen.getAllByText('What sits behind that number');
screen.getAllByText('Strongest readiness factors');
screen.getAllByText('Most important gaps');
screen.getAllByText('Validate before any pilot');
screen.getAllByText('Recommended next discovery action');
ok('strengths, gaps, validation needs and next action all present');
fireEvent.click(screen.getAllByRole('button', { name: /How this score was formed/ })[0]);
await screen.findByText(/Eleven weighted factors/);
ok('"How this score was formed" panel opens and explains the method');

step('Opportunity detail and assumptions');
fireEvent.click(screen.getAllByText('Customer Service Automation')[0]);
const panel = await screen.findByRole('dialog');
within(panel).getByText('Assumptions behind this estimate');
ok('assumptions section present');
within(panel).getByText('Work volume');
within(panel).getByText('Current handling time');
within(panel).getByText('Repetitive / addressable share');
within(panel).getByText('Expected time saving');
within(panel).getByText('Expected adoption / utilisation');
within(panel).getByText('Quality / rework adjustment');
within(panel).getByText('Loaded labour cost');
ok('all seven drivers listed, including volume, handling time and loaded cost');
assert(
  within(panel).getAllByText('Illustrative assumption').length > 0 &&
    within(panel).getAllByText('Requires validation').length > 0,
  'provenance tags missing',
);
ok('drivers tagged by provenance');
within(panel).getByText(/Low confidence/);
ok('confidence stated, and it is low');
within(panel).getByText('Hours in scope each year');
within(panel).getByText('Hours plausibly saved');
within(panel).getByText('Point estimate');
within(panel).getByText('Published range');
ok('the calculation is shown as a chain, not a bare total');
within(panel).getByText('What a discovery sprint would establish');
ok('validation requirements listed');

const beforeText = within(panel).getAllByText(/€\d+K–€\d+K/)[0].textContent;
const volumeSlider = within(panel).getByLabelText('Work volume') as HTMLInputElement;
fireEvent.change(volumeSlider, { target: { value: '2000' } });
await waitFor(() => {
  const now = within(screen.getByRole('dialog')).getAllByText(/€\d+K–€\d+K/)[0]
    .textContent;
  if (now === beforeText) throw new Error('estimate did not change');
});
ok(`halving work volume recalculated the estimate (${beforeText} changed)`);
await screen.findByText('Reset to defaults');
fireEvent.click(screen.getAllByRole('button', { name: 'Reset to defaults' })[0]);
await waitFor(() => {
  const now = within(screen.getByRole('dialog')).getAllByText(/€\d+K–€\d+K/)[0]
    .textContent;
  if (now !== beforeText) throw new Error('reset did not restore the default');
});
ok('reset restores the default assumption');

fireEvent.click(
  within(screen.getByRole('dialog')).getByRole('button', {
    name: 'Explore this worker concept',
  }),
);
await waitFor(() => {
  if (screen.queryAllByRole('dialog').length === 0) throw new Error('no panel');
});
const workerPanel = screen.getByRole('dialog');
within(workerPanel).getByText('Customer Operations Worker');
within(workerPanel).getByText('Prerequisites before a pilot');
ok('worker concept panel opens and leads with pilot prerequisites');
fireEvent.click(within(workerPanel).getByRole('button', { name: 'Close panel' }));
await waitFor(() => {
  if (screen.queryAllByRole('dialog').length) throw new Error('panel still open');
});
ok('panel closes');

step('Operating model and journey');
screen.getAllByText('What the same organisation could look like');
screen.getAllByText('This is an augmentation model, not a reduction plan.');
ok('augmentation framing preserved');
screen.getAllByText('From an indicative map to measured results');
for (const phase of [
  'Initial assessment',
  'Expert validation',
  'AI Value Discovery Sprint',
  'Business case',
  'Transformation roadmap',
  'Controlled pilot',
  'Implementation',
  'Measurement and scale',
])
  screen.getAllByText(phase);
ok('all eight advisory stages present');
screen.getAllByText('You are here');
ok('the roadmap marks where the user currently is');
screen.getAllByText('Gates before a pilot or implementation');
for (const gate of [
  'Opportunity validated by process owner',
  'Baseline confirmed',
  'Finance agrees the value assumptions',
  'Data and security review completed',
  'Human approval model agreed',
  'Evaluation criteria agreed',
  'Access and integration scope approved',
  'Commercial approval completed',
])
  screen.getAllByText(gate);
ok('all eight delivery gates present');
screen.getAllByText(/A validated pilot may be achievable within the first 90 days/);
ok('90-day plan carries the conditional caveat');
screen.getAllByText('Beyond 90 days');
ok('phases beyond 90 days are shown separately, not compressed in');

step('Advisory CTAs');
const validateButtons = screen.getAllByRole('button', {
  name: 'Validate this opportunity map',
});
assert(validateButtons.length >= 2, 'primary advisory CTA missing');
ok(`primary CTA "Validate this opportunity map" present (${validateButtons.length} places)`);
assert(
  screen.getAllByRole('button', { name: 'Explore a controlled pilot' }).length >= 1,
  'secondary advisory CTA missing',
);
ok('secondary CTA "Explore a controlled pilot" present');

const buildCtas = screen
  .queryAllByRole('button')
  .filter((b) => b.textContent?.trim() === 'Build with Smooth Operator');
assert(buildCtas.length === 0, `"Build with Smooth Operator" still appears ${buildCtas.length} times`);
ok('repeated "Build with Smooth Operator" CTAs removed');

fireEvent.click(validateButtons[0]);
const validateModal = await screen.findByRole('dialog');
within(validateModal).getByText('Validate this opportunity map');
within(validateModal).getByText(/ValueShore advisor/);
ok('validation CTA opens an advisory explanation, not a dead end');
fireEvent.click(within(validateModal).getByRole('button', { name: 'Close' }));
await waitFor(() => {
  if (screen.queryAllByRole('dialog').length) throw new Error('modal still open');
});

step('Delivery handoff (demonstration)');
screen.getAllByText('Smooth Operator, if a pilot goes ahead');
ok('Smooth Operator introduced only at the delivery stage');
fireEvent.click(
  screen.getAllByRole('button', { name: /Preview the Smooth Operator handoff/ })[0],
);
await screen.findByText('Preparing a draft for Smooth Operator');
ok('handoff demonstration preserved');
await screen.findByText(
  'Draft prepared for pilot design in Smooth Operator',
  {},
  { timeout: 20000 },
);
ok('packaging completes as a draft for pilot design, not a production config');
assert(
  screen.getAllByText(/Still to establish:/).length === 6,
  'artefacts do not state what remains outstanding',
);
ok('all six artefacts state what discovery still has to establish');

const openBtn = screen.getAllByRole('button', {
  name: /Open in Smooth Operator/,
})[0] as HTMLButtonElement;
assert(!openBtn.disabled, 'open button still disabled after packaging');
fireEvent.click(openBtn);
await screen.findByText(/The concept has arrived as a draft/, {}, { timeout: 10000 });
ok('Smooth Operator placeholder screen');
screen.getAllByText(/SO-DRAFT-/);
screen.getAllByText(/Six still require validation/);
ok('draft reference shown, with outstanding work stated');

step('Return');
fireEvent.click(
  screen.getAllByRole('button', { name: /Return to your AI Transformation Map/ })[0],
);
await screen.findByText('Your AI Transformation Map');
ok('returns to the dashboard');
await screen.findByText('Handoff previewed');
ok('worker card records that the handoff was previewed');

/* ================================================================== */
/* PART 3 — the blank assessment                                       */
/* ================================================================== */

cleanup();
render(React.createElement(App));

step('Blank assessment');
await screen.findByText('Design Your AI Operating Model');
fireEvent.click(
  screen.getAllByRole('button', { name: 'Start with a blank assessment' })[0],
);
await screen.findByText('Tell us about your company');

assert(
  screen.queryByText(/Pre-filled with a worked example so you can walk/) === null,
  'blank assessment still claims to be pre-filled with a worked example',
);
screen.getAllByText('Blank assessment');
ok('sidebar guidance matches the blank state');

const nameField = screen.getAllByLabelText(/Company name/)[0] as HTMLInputElement;
assert(nameField.value === '', 'blank assessment is not actually blank');
ok('fields start empty');

fireEvent.click(screen.getAllByRole('button', { name: /Continue/ })[0]);
await screen.findByText(/Enter your company name/);
screen.getAllByText(/Choose an industry/);
screen.getAllByText(/Enter your approximate total headcount/);
ok('per-field guidance shown, not just "complete this step"');
assert(nameField.getAttribute('aria-invalid') === 'true', 'field not marked invalid');
const described = nameField.getAttribute('aria-describedby');
assert(
  !!described && document.getElementById(described.split(' ').pop()!)?.textContent?.includes('Enter your company name'),
  'error message is not associated with its field',
);
ok('errors are associated with their fields for assistive technology');
screen.getAllByText(/fields need attention above/);
ok('a summary of how many fields need attention');

fireEvent.change(nameField, { target: { value: 'Test Company Ltd' } });
fireEvent.change(screen.getAllByLabelText(/Industry/)[0], {
  target: { value: 'Manufacturing' },
});
fireEvent.change(screen.getAllByLabelText(/Number of employees/)[0], {
  target: { value: '150' },
});
fireEvent.click(screen.getAllByRole('button', { name: /Continue/ })[0]);
await screen.findByText('Tell us about your workforce');
ok('advances once the required fields are completed');

fireEvent.click(screen.getAllByRole('button', { name: /^Back$/ })[0]);
await screen.findByText('Tell us about your company');
const preserved = screen.getAllByLabelText(/Company name/)[0] as HTMLInputElement;
assert(
  preserved.value === 'Test Company Ltd',
  'going back lost the entered information',
);
ok('going back preserves entered information');

/* ================================================================== */

console.log('\n────────────────────────────');
const real = errors.filter((e) => !/not wrapped in act|ReactDOMTestUtils/.test(e));
if (real.length) {
  console.log('CONSOLE ERRORS:', real.length);
  real.slice(0, 10).forEach((e) => console.log(' !', e.slice(0, 300)));
  process.exit(1);
}
console.log('ALL PASSED — 0 console errors');
process.exit(0);
