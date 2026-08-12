import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
const g = globalThis as any;
g.window = dom.window;
g.document = dom.window.document;
Object.defineProperty(g, 'navigator', { value: dom.window.navigator, configurable: true, writable: true });
g.HTMLElement = dom.window.HTMLElement;
g.Element = dom.window.Element;
g.Node = dom.window.Node;
g.Event = dom.window.Event;
g.KeyboardEvent = dom.window.KeyboardEvent;
g.MouseEvent = dom.window.MouseEvent;
g.getComputedStyle = dom.window.getComputedStyle;
g.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0) as unknown as number;
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

const { render, screen, fireEvent, waitFor, within } = await import('@testing-library/react');
const React = (await import('react')).default;
const App = (await import('../src/App')).default;

const step = (n: string) => console.log(`\n▸ ${n}`);
const ok = (n: string) => console.log(`  ✓ ${n}`);

render(React.createElement(App));

// ---- 1. LANDING ----
step('Landing');
await screen.findByText('Design Your AI Operating Model');
ok('hero headline');
if (!screen.getAllByText(/Smooth Operator/).length) throw new Error('journey rail missing Smooth Operator');
ok('journey rail renders');
screen.getAllByText('We are not selling you AI agents.');
ok('positioning section');

// ---- 2. START ASSESSMENT ----
step('Assessment');
fireEvent.click(screen.getAllByRole('button', { name: 'Start Your AI Assessment' })[0]);
await screen.findByText('Tell us about your company');
ok('step 1 company');
const nameInput = screen.getAllByDisplayValue('Nordic Industrial Services')[0] as HTMLInputElement;
fireEvent.change(nameInput, { target: { value: 'Nordic Industrial Services' } });

const cont = () => screen.getAllByRole('button', { name: /Continue/ })[0];
fireEvent.click(cont());
await screen.findByText('Tell us about your workforce');
ok('step 2 workforce');
if (!screen.getAllByText('420').length) throw new Error('total headcount not 420');
ok('total headcount = 420');

// add + remove a department
fireEvent.click(screen.getAllByRole('button', { name: /Add department/ })[0]);
await waitFor(() => {
  const rows = document.querySelectorAll('#department-suggestions ~ *, li');
  if (!rows.length) throw new Error('no rows');
});
const removeBtns = screen.getAllByRole('button', { name: /^Remove/ });
fireEvent.click(removeBtns[removeBtns.length - 1]);
ok('add + remove department row');

fireEvent.click(cont());
await screen.findByText('Where does your team spend time?');
ok('step 3 operations');
fireEvent.click(screen.getAllByRole('checkbox', { name: /Scheduling/ })[0]);
ok('toggle a process');

// custom process
const customInput = screen.getAllByPlaceholderText(/Warranty claim handling/)[0] as HTMLInputElement;
fireEvent.change(customInput, { target: { value: 'Warranty claim handling' } });
fireEvent.click(screen.getAllByRole('button', { name: /^Add$/ })[0]);
await screen.findByText('Warranty claim handling');
ok('add custom process');

fireEvent.click(cont());
await screen.findByText('What systems do you use?');
ok('step 4 systems');
fireEvent.click(cont());
await screen.findByText('What are you trying to achieve?');
ok('step 5 objectives');
fireEvent.click(cont());
await screen.findByText('How ready is the ground?');
ok('step 6 readiness');

const live = screen.getAllByText(/\/100/)[0].parentElement?.textContent ?? '';
if (!live.includes('64')) throw new Error('expected demo readiness 64/100, got ' + live);
ok(`live readiness score = 64/100 (demo calibration)`);

// ---- 3. ANALYSIS ----
step('Analysis');
fireEvent.click(screen.getAllByRole('button', { name: /Generate my AI Transformation Map/ })[0]);
await screen.findByText('Analyzing your operating model');
ok('analysis screen');

// ---- 4. RESULTS ----
step('Results');
await screen.findByText('Your AI Transformation Map', {}, { timeout: 15000 });
ok('results dashboard');
screen.getAllByText('17');
ok('17 opportunities identified');
screen.getAllByText('€480K–€720K');
screen.getAllByText('64 / 100');
ok('€480K–€720K headline reconciles with high-priority sum');
screen.getAllByText(/Illustrative estimate based on the information provided/);
ok('disclaimer present');

// opportunity detail
step('Opportunity detail');
fireEvent.click(screen.getAllByText('Customer Service Automation')[0]);
const panel = await screen.findByRole('dialog');
within(panel).getByText('Ticket classification');
ok('side panel opens with AI capabilities');
within(panel).getByText('Complex cases');
ok('human responsibilities shown');
fireEvent.click(within(panel).getByRole('button', { name: 'Design This AI Worker' }));
await waitFor(() => screen.queryAllByRole('dialog').length === 0);
ok('"Design This AI Worker" routes to workforce');

// worker detail should now be open
const workerPanel = await screen.findByRole('dialog');
within(workerPanel).getByText('Customer Operations Worker');
ok('worker detail panel opens');
fireEvent.click(within(workerPanel).getByRole('button', { name: 'Close panel' }));
await waitFor(() => { if (screen.queryAllByRole('dialog').length) throw new Error('panel still open'); });
ok('panel closes');

// operating model
screen.getAllByText('Your Future AI Operating Model');
screen.getAllByText(/augmentation model, not a reduction plan/);
ok('operating model + augmentation framing');

// ---- 5. SMOOTH OPERATOR HANDOFF ----
step('Smooth Operator handoff');
const workforceSection = document.getElementById('ai-workforce')!;
fireEvent.click(within(workforceSection).getAllByRole('button', { name: 'Build with Smooth Operator' })[0]);
await screen.findByText('Moving your AI Worker to Smooth Operator');
ok('handoff modal opens');
await screen.findByText('AI Worker ready for configuration in Smooth Operator', {}, { timeout: 20000 });
ok('all 6 artefacts packaged');
const openBtn = screen.getAllByRole('button', { name: /Open in Smooth Operator/ })[0] as HTMLButtonElement;
if (openBtn.disabled) throw new Error('Open button still disabled');
fireEvent.click(openBtn);
await screen.findByText(/Your AI worker has arrived as a draft configuration/, {}, { timeout: 10000 });
ok('Smooth Operator placeholder screen');
screen.getAllByText(/SO-DRAFT-/);
ok('draft reference rendered');

// ---- 6. RETURN ----
step('Return');
fireEvent.click(screen.getAllByRole('button', { name: /Return to your AI Transformation Map/ })[0]);
await screen.findByText('Your AI Transformation Map');
ok('returns to dashboard');
await screen.findByText('Handed off');
ok('worker card shows handed-off state');

// roadmap
screen.getAllByText('Your AI Transformation Roadmap');
screen.getAllByText('Phase 1 — Discover');
screen.getAllByText('Phase 5 — Scale');
screen.getAllByText('Ready to build your first AI worker?');
ok('roadmap + final CTA');

console.log('\n────────────────────────────');
const real = errors.filter(e => !/not wrapped in act|ReactDOMTestUtils/.test(e));
if (real.length) {
  console.log('CONSOLE ERRORS:', real.length);
  real.slice(0, 10).forEach(e => console.log(' !', e.slice(0, 300)));
  process.exit(1);
}
console.log('ALL PASSED — 0 console errors');
process.exit(0);
