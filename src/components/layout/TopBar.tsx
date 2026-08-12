import { useEffect, useState } from 'react';
import { Button } from '../ui';
import { Logo } from './Logo';
import { useAdvisor } from '../../state/AdvisorProvider';
import { cn } from '../../utils/cn';

export function TopBar() {
  const { view, actions, map } = useAdvisor();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showResultsNav = view === 'results';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b transition-all duration-300',
        scrolled
          ? 'border-line bg-surface/85 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-[1360px] items-center justify-between gap-6 px-5 sm:px-8">
        <button
          type="button"
          onClick={actions.reset}
          className="shrink-0 text-left"
          aria-label="Back to start"
        >
          <Logo />
        </button>

        {showResultsNav && (
          <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-muted lg:flex">
            {[
              ['#opportunities', 'Opportunities'],
              ['#operating-model', 'Operating model'],
              ['#ai-workforce', 'AI workforce'],
              ['#roadmap', 'Roadmap'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="transition-colors hover:text-ink"
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
                Start your AI assessment
              </Button>
            </>
          )}
          {view === 'assessment' && (
            <Button variant="quiet" size="sm" onClick={actions.reset}>
              Exit assessment
            </Button>
          )}
          {showResultsNav && map && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => actions.startAssessment()}
              >
                Edit assessment
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  document
                    .getElementById('ai-workforce')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Build with Smooth Operator
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
