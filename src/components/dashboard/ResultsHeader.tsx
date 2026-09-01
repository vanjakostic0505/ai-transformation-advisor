import type { TransformationMap } from '../../types';
import { Stat, Button, StatusLabel, PromiseBanner, ConfidenceMeter } from '../ui';
import { ArrowRight } from '../ui/Icons';
import { formatValueRange, formatNumber } from '../../utils/format';

export function ResultsHeader({
  map,
  onValidate,
  onExplorePilot,
}: {
  map: TransformationMap;
  onValidate: () => void;
  onExplorePilot: () => void;
}) {
  const { summary, input } = map;

  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_20%_0%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-[1360px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow animate-fade-up">
              {input.company.name} · {input.company.industry} ·{' '}
              {formatNumber(map.operatingModel.current.people)} employees
            </p>

            <h1
              className="display-1 mt-4 animate-fade-up text-ink text-balance"
              style={{ animationDelay: '60ms' }}
            >
              Your AI Transformation Map
            </h1>

            <div
              className="mt-4 flex animate-fade-up flex-wrap items-center gap-3"
              style={{ animationDelay: '90ms' }}
            >
              <StatusLabel>Indicative first-pass assessment</StatusLabel>
              <ConfidenceMeter confidence={summary.confidence} />
            </div>

            <p
              className="mt-4 max-w-xl animate-fade-up text-[16px] leading-relaxed text-muted text-pretty"
              style={{ animationDelay: '110ms' }}
            >
              Where AI might create value in your operation, what a target
              operating model could look like, and which worker concepts are
              worth investigating first.
            </p>
          </div>

          <div
            className="flex animate-fade-up flex-col gap-2.5 sm:flex-row lg:shrink-0"
            style={{ animationDelay: '160ms' }}
          >
            <Button
              onClick={onValidate}
              iconRight={<ArrowRight aria-hidden className="size-4" />}
            >
              Validate this opportunity map
            </Button>
            <Button variant="secondary" onClick={onExplorePilot}>
              Explore a controlled pilot
            </Button>
          </div>
        </div>

        <PromiseBanner className="mt-9 max-w-4xl" />

        <div
          className="mt-6 grid animate-fade-up gap-4 sm:grid-cols-2 xl:grid-cols-5"
          style={{ animationDelay: '210ms' }}
        >
          <Stat
            label="Indicative AI readiness"
            value={`${summary.readiness.score} / ${summary.readiness.outOf}`}
            sub={summary.readiness.band}
            status="Indicative"
            accent
          />
          <Stat
            label="Potential AI opportunities indicated"
            value={String(summary.opportunitiesIndicated)}
            sub={`Top ${map.opportunities.length} shown, provisionally ranked`}
            status="Indicative"
          />
          <Stat
            label="Provisionally high priority"
            value={String(summary.highPriorityOpportunities)}
            sub="Ranking to be confirmed by expert validation"
            status="Provisional"
          />
          <Stat
            label="Provisional AI worker concepts"
            value={String(summary.workerConcepts)}
            sub="Subject to discovery and pilot validation"
            status="Provisional"
          />
          <Stat
            label="Indicative annual value"
            value={formatValueRange(summary.estimatedAnnualValue)}
            sub="Sum of the high-priority estimates, before validation"
            status="Indicative"
            accent
          />
        </div>
      </div>
    </section>
  );
}
