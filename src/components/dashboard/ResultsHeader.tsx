import type { TransformationMap } from '../../types';
import { Stat, Disclaimer, Button } from '../ui';
import { ArrowRight } from '../ui/Icons';
import { formatValueRange, formatNumber } from '../../utils/format';

export function ResultsHeader({ map }: { map: TransformationMap }) {
  const { summary, input } = map;

  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_20%_0%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-[1360px] px-5 py-14 sm:px-8 lg:py-18">
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
            <p
              className="mt-4 max-w-xl animate-fade-up text-[16px] leading-relaxed text-muted text-pretty"
              style={{ animationDelay: '110ms' }}
            >
              Where AI creates measurable value in your operation, what the
              target operating model looks like, and which AI workers to build
              first.
            </p>
          </div>

          <div
            className="flex animate-fade-up flex-col gap-2.5 sm:flex-row lg:shrink-0"
            style={{ animationDelay: '160ms' }}
          >
            <Button
              onClick={() =>
                document
                  .getElementById('opportunities')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              iconRight={<ArrowRight className="size-4" />}
            >
              Review opportunities
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                document
                  .getElementById('roadmap')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Open transformation roadmap
            </Button>
          </div>
        </div>

        <div
          className="mt-12 grid animate-fade-up gap-4 sm:grid-cols-2 xl:grid-cols-5"
          style={{ animationDelay: '210ms' }}
        >
          <Stat
            label="AI readiness score"
            value={`${summary.readinessScore} / ${summary.readinessOutOf}`}
            sub={summary.readinessBand}
            accent
          />
          <Stat
            label="AI opportunities identified"
            value={String(summary.opportunitiesIdentified)}
            sub={`Top ${map.opportunities.length} shown below`}
          />
          <Stat
            label="High-priority opportunities"
            value={String(summary.highPriorityOpportunities)}
            sub="Sequenced into the first two waves"
          />
          <Stat
            label="Recommended AI workers"
            value={String(summary.recommendedWorkers)}
            sub="Ready to configure in Smooth Operator"
          />
          <Stat
            label="Estimated annual value"
            value={formatValueRange(summary.estimatedAnnualValue)}
            sub="Sum of the high-priority opportunities"
            accent
          />
        </div>

        <Disclaimer className="mt-5 max-w-3xl">{summary.disclaimer}</Disclaimer>
      </div>
    </section>
  );
}
