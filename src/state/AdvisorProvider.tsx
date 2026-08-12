import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AssessmentInput,
  CompanyProfile,
  ObjectivesProfile,
  ProcessProfile,
  ReadinessProfile,
  SystemsProfile,
  TransformationMap,
  WorkforceUnit,
} from '../types';
import { DEMO_ASSESSMENT, EMPTY_ASSESSMENT } from '../data/demoCompany';
import { generateTransformationMap } from '../engine/advisorEngine';

export type AppView =
  | 'landing'
  | 'assessment'
  | 'analysis'
  | 'results'
  | 'smooth-operator';

export const ASSESSMENT_STEPS = [
  { id: 'company', label: 'Company' },
  { id: 'workforce', label: 'Workforce' },
  { id: 'operations', label: 'Operations' },
  { id: 'systems', label: 'Systems' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'readiness', label: 'AI readiness' },
] as const;

export type AssessmentStepId = (typeof ASSESSMENT_STEPS)[number]['id'];

interface AdvisorState {
  view: AppView;
  stepIndex: number;
  input: AssessmentInput;
  map: TransformationMap | null;
  /** Worker whose Smooth Operator handoff has been completed */
  handedOffWorkerId: string | null;
}

interface AdvisorActions {
  goTo: (view: AppView) => void;
  startAssessment: (options?: { prefill?: boolean }) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  loadDemoData: () => void;
  updateCompany: (patch: Partial<CompanyProfile>) => void;
  toggleMarket: (market: string) => void;
  addWorkforceUnit: () => void;
  updateWorkforceUnit: (id: string, patch: Partial<WorkforceUnit>) => void;
  removeWorkforceUnit: (id: string) => void;
  updateProcesses: (patch: Partial<ProcessProfile>) => void;
  toggleProcess: (id: string) => void;
  addCustomProcess: (label: string) => void;
  updateSystems: (patch: Partial<SystemsProfile>) => void;
  toggleSystem: (id: string) => void;
  addCustomSystem: (label: string) => void;
  updateObjectives: (patch: Partial<ObjectivesProfile>) => void;
  toggleObjective: (id: string) => void;
  updateReadiness: (patch: Partial<ReadinessProfile>) => void;
  runAnalysis: () => Promise<void>;
  completeAnalysis: () => void;
  markHandedOff: (workerId: string) => void;
  reset: () => void;
}

type AdvisorContextValue = AdvisorState & {
  actions: AdvisorActions;
  totalHeadcount: number;
  stepId: AssessmentStepId;
  isStepValid: boolean;
};

const AdvisorContext = createContext<AdvisorContextValue | null>(null);

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function AdvisorProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppView>('landing');
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState<AssessmentInput>(() => clone(DEMO_ASSESSMENT));
  const [map, setMap] = useState<TransformationMap | null>(null);
  const [handedOffWorkerId, setHandedOffWorkerId] = useState<string | null>(null);

  const totalHeadcount = useMemo(
    () => input.workforce.units.reduce((acc, u) => acc + (u.headcount || 0), 0),
    [input.workforce.units],
  );

  const stepId = ASSESSMENT_STEPS[stepIndex].id;

  const isStepValid = useMemo(() => {
    switch (stepId) {
      case 'company':
        return (
          input.company.name.trim().length > 1 &&
          input.company.industry !== '' &&
          input.company.employeeCount > 0
        );
      case 'workforce':
        return totalHeadcount > 0;
      case 'operations':
        return (
          input.processes.selectedProcessIds.length +
            input.processes.customProcesses.length >
          0
        );
      case 'systems':
        return (
          input.systems.selectedSystemIds.length +
            input.systems.customSystems.length >
          0
        );
      case 'objectives':
        return input.objectives.selectedObjectiveIds.length > 0;
      case 'readiness':
        return true;
      default:
        return true;
    }
  }, [stepId, input, totalHeadcount]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const actions: AdvisorActions = useMemo(
    () => ({
      goTo: (next) => {
        setView(next);
        scrollTop();
      },
      startAssessment: (options) => {
        if (options?.prefill === false) setInput(clone(EMPTY_ASSESSMENT));
        setStepIndex(0);
        setView('assessment');
        scrollTop();
      },
      nextStep: () => {
        setStepIndex((i) => Math.min(i + 1, ASSESSMENT_STEPS.length - 1));
        scrollTop();
      },
      previousStep: () => {
        setStepIndex((i) => Math.max(i - 1, 0));
        scrollTop();
      },
      goToStep: (index) => {
        setStepIndex(Math.max(0, Math.min(index, ASSESSMENT_STEPS.length - 1)));
        scrollTop();
      },
      loadDemoData: () => setInput(clone(DEMO_ASSESSMENT)),
      updateCompany: (patch) =>
        setInput((s) => ({ ...s, company: { ...s.company, ...patch } })),
      toggleMarket: (market) =>
        setInput((s) => ({
          ...s,
          company: { ...s.company, markets: toggle(s.company.markets, market) },
        })),
      addWorkforceUnit: () =>
        setInput((s) => ({
          ...s,
          workforce: {
            units: [
              ...s.workforce.units,
              { id: `wf-${Date.now()}`, department: '', headcount: 0 },
            ],
          },
        })),
      updateWorkforceUnit: (id, patch) =>
        setInput((s) => ({
          ...s,
          workforce: {
            units: s.workforce.units.map((u) =>
              u.id === id ? { ...u, ...patch } : u,
            ),
          },
        })),
      removeWorkforceUnit: (id) =>
        setInput((s) => ({
          ...s,
          workforce: { units: s.workforce.units.filter((u) => u.id !== id) },
        })),
      updateProcesses: (patch) =>
        setInput((s) => ({ ...s, processes: { ...s.processes, ...patch } })),
      toggleProcess: (id) =>
        setInput((s) => ({
          ...s,
          processes: {
            ...s.processes,
            selectedProcessIds: toggle(s.processes.selectedProcessIds, id),
          },
        })),
      addCustomProcess: (label) =>
        setInput((s) =>
          !label.trim() || s.processes.customProcesses.includes(label.trim())
            ? s
            : {
                ...s,
                processes: {
                  ...s.processes,
                  customProcesses: [...s.processes.customProcesses, label.trim()],
                },
              },
        ),
      updateSystems: (patch) =>
        setInput((s) => ({ ...s, systems: { ...s.systems, ...patch } })),
      toggleSystem: (id) =>
        setInput((s) => ({
          ...s,
          systems: {
            ...s.systems,
            selectedSystemIds: toggle(s.systems.selectedSystemIds, id),
          },
        })),
      addCustomSystem: (label) =>
        setInput((s) =>
          !label.trim() || s.systems.customSystems.includes(label.trim())
            ? s
            : {
                ...s,
                systems: {
                  ...s.systems,
                  customSystems: [...s.systems.customSystems, label.trim()],
                },
              },
        ),
      updateObjectives: (patch) =>
        setInput((s) => ({ ...s, objectives: { ...s.objectives, ...patch } })),
      toggleObjective: (id) =>
        setInput((s) => ({
          ...s,
          objectives: {
            selectedObjectiveIds: toggle(s.objectives.selectedObjectiveIds, id),
          },
        })),
      updateReadiness: (patch) =>
        setInput((s) => ({ ...s, readiness: { ...s.readiness, ...patch } })),
      runAnalysis: async () => {
        setView('analysis');
        scrollTop();
        const result = await generateTransformationMap(input);
        setMap(result);
      },
      completeAnalysis: () => {
        setView('results');
        scrollTop();
      },
      markHandedOff: (workerId) => setHandedOffWorkerId(workerId),
      reset: () => {
        setInput(clone(DEMO_ASSESSMENT));
        setMap(null);
        setStepIndex(0);
        setHandedOffWorkerId(null);
        setView('landing');
        scrollTop();
      },
    }),
    [input],
  );

  const value = useMemo(
    () => ({
      view,
      stepIndex,
      input,
      map,
      handedOffWorkerId,
      actions,
      totalHeadcount,
      stepId,
      isStepValid,
    }),
    [view, stepIndex, input, map, handedOffWorkerId, actions, totalHeadcount, stepId, isStepValid],
  );

  return <AdvisorContext.Provider value={value}>{children}</AdvisorContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdvisor(): AdvisorContextValue {
  const ctx = useContext(AdvisorContext);
  if (!ctx) throw new Error('useAdvisor must be used inside <AdvisorProvider>');
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdvisorActions(): AdvisorActions {
  return useAdvisor().actions;
}
