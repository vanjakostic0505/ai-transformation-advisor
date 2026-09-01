import { useState } from 'react';
import { AdvisorProvider, useAdvisor } from './state/AdvisorProvider';
import type { SmoothOperatorHandoff } from './types';
import { TopBar } from './components/layout/TopBar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AssessmentFlow } from './components/assessment/AssessmentFlow';
import { AnalysisScreen } from './components/analysis/AnalysisScreen';
import { ResultsPage } from './components/dashboard/ResultsPage';
import { SmoothOperatorScreen } from './components/smooth-operator/SmoothOperatorScreen';

function Views() {
  const { view, map, handedOffWorkerId, overrides, actions } = useAdvisor();
  const [handoff, setHandoff] = useState<SmoothOperatorHandoff | null>(null);

  const handoffWorker = map?.workers.find((w) => w.id === handoff?.workerId);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2.5 focus:text-[14px] focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <TopBar />

      <main id="main" className="flex-1">
        {view === 'landing' && <LandingPage />}
        {view === 'assessment' && <AssessmentFlow />}
        {view === 'analysis' && <AnalysisScreen />}

        {view === 'results' && map && (
          <ResultsPage
            map={map}
            overrides={overrides}
            previewedWorkerId={handedOffWorkerId}
            onDriverChange={actions.setDriverOverride}
            onResetOpportunity={actions.resetOpportunityOverrides}
            onResetAll={actions.resetAllOverrides}
            onHandoffComplete={(result) => {
              setHandoff(result);
              actions.markHandedOff(result.workerId);
              actions.goTo('smooth-operator');
            }}
          />
        )}

        {view === 'smooth-operator' && handoff && handoffWorker && (
          <SmoothOperatorScreen
            handoff={handoff}
            worker={handoffWorker}
            onBack={() => actions.goTo('results')}
          />
        )}
      </main>

      {(view === 'landing' || view === 'results') && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AdvisorProvider>
      <Views />
    </AdvisorProvider>
  );
}
