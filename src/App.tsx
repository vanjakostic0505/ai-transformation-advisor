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
  const { view, map, handedOffWorkerId, actions } = useAdvisor();
  const [handoff, setHandoff] = useState<SmoothOperatorHandoff | null>(null);

  const handoffWorker = map?.workers.find((w) => w.id === handoff?.workerId);

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />

      <main className="flex-1">
        {view === 'landing' && <LandingPage />}
        {view === 'assessment' && <AssessmentFlow />}
        {view === 'analysis' && <AnalysisScreen />}

        {view === 'results' && map && (
          <ResultsPage
            map={map}
            deployedWorkerId={handedOffWorkerId}
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
