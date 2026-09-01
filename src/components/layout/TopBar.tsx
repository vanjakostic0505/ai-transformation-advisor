import { useEffect, useState } from 'react';
import { Button } from '../ui';
import { Logo } from './Logo';
import { useAdvisor } from '../../state/AdvisorProvider';
import { cn } from '../../utils/cn';

const RESULTS_NAV = [
  ['#readiness', 'Readiness'],
  ['#opportunities', 'Opportunities'],
  ['#operating-model', 'Operating model'],
  ['#ai-workforce', 'Worker concepts'],
  ['#roadmap', 'Journey'],
] as const;

export function TopBar() {
  const { view, actions } = useAdvisor();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onResults = view === 'results';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b transition-all duration-300',
        scrolled
          ? 'border-line bg-surface/90 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-3 px-5 sm:gap-6 sm:px-8">
        <button
          type="button"
          onClick={actions.reset}
          className="shrink-0 rounded-lg text-left"
          aria-label="AI Transformation Advisor — return to start"
        >
          <Logo />
        </button>

        {onResults && (
          <nav
            aria-label="Results sections"
            className="hidden items-center gap-6 text-[13.5px] font-medium text-muted xl:flex"
          >
            {RESULTS_NAV.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded transition-colors hover:text-ink"
              >
                {label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-2.5">
          {view === 'landing' && (
            <>
              <Button
                variant="quiet"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() =>
                  document
                    .getElementById('how-it-works')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                How it works
              </Button>
              <Button size="sm" onClick={() => actions.startAssessment()}>
                <span className="sm:hidden">Start assessment</span>
                <span className="hidden sm:inline">Start your AI assessment</span>
              </Button>
            </>
          )}

          {view === 'assessment' && (
            <Button variant="quiet" size="sm" onClick={actions.reset}>
              Exit assessment
            </Button>
          )}

          {onResults && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => actions.startAssessment()}
              >
                Edit answers
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  document
                    .getElementById('delivery')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Next steps
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
