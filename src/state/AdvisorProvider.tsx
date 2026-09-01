import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AssessmentInput,
  CompanyProfile,
  DriverOverrides,
  ObjectivesProfile,
  ProcessProfile,
  ReadinessKey,
  ReadinessScore,
  SystemsProfile,
  TransformationMap,
  WorkforceUnit,
} from '../types';
import { DEMO_ASSESSMENT, EMPTY_ASSESSMENT } from '../data/demoCompany';
import { deriveMap, generateTransformationMap } from '../engine/advisorEngine';

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

/** Field-level validation messages, keyed by field id. */
export type FieldErrors = Record<string, string>;

interface AdvisorActions {
  goTo: (view: AppView) => void;
  startAssessment: (options?: { prefill?: boolean }) => void;
  /** Advances if the step is valid; otherwise reveals the field errors. */
  tryContinue: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  loadDemoData: () => void;
  clearAssessment: () => void;
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
  updateReadiness: (key: ReadinessKey, value: ReadinessScore) => void;
  runAnalysis: () => Promise<void>;
  completeAnalysis: () => void;
  markHandedOff: (workerId: string) => void;
  /** Adjust one assumption behind one opportunity's estimate. */
  setDriverOverride: (
    opportunityId: string,
    driverId: string,
    value: number,
  ) => void;
  resetOpportunityOverrides: (opportunityId: string) => void;
  resetAllOverrides: () => void;
  reset: () => void;
}

type AdvisorContextValue = {
  view: AppView;
  stepIndex: number;
  input: AssessmentInput;
  map: TransformationMap | null;
  handedOffWorkerId: string | null;
  /** True while the pre-filled worked example is loaded */
  isDemoData: boolean;
  overrides: DriverOverrides;
  actions: AdvisorActions;
  totalHeadcount: number;
  stepId: AssessmentStepId;
  isStepValid: boolean;
  fieldErrors: FieldErrors;
  /** Errors are hidden until the user has tried to continue */
  showErrors: boolean;
};

const AdvisorContext = createContext<AdvisorContextValue | null>(null);

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

/**
 * Field-level validation for the current step.
 *
 * Returning messages per field, rather than a single boolean, is what lets the
 * form say which box needs attention instead of only "complete this step".
 */
function validateStep(
  stepId: AssessmentStepId,
  input: AssessmentInput,
  totalHeadcount: number,
): FieldErrors {
  const errors: FieldErrors = {};

  switch (stepId) {
    case 'company': {
      if (input.company.name.trim().length < 2)
        errors['company-name'] = 'Enter your company name so the report can be addressed to it.';
      if (!input.company.industry)
        errors['company-industry'] = 'Choose an industry — it changes which opportunities are considered.';
      if (!input.company.employeeCount || input.company.employeeCount < 1)
        errors['company-employees'] = 'Enter your approximate total headcount. A rough figure is fine.';
      break;
    }
    case 'workforce': {
      if (totalHeadcount < 1)
        errors['workforce-total'] = 'Add at least one department with a headcount above zero.';
      const unnamed = input.workforce.units.filter(
        (u) => u.headcount > 0 && !u.department.trim(),
      );
      if (unnamed.length)
        errors['workforce-names'] = `${unnamed.length} ${unnamed.length === 1 ? 'row has' : 'rows have'} a headcount but no department name.`;
      break;
    }
    case 'operations': {
      const count =
        input.processes.selectedProcessIds.length +
        input.processes.customProcesses.length;
      if (count === 0)
        errors['operations-selection'] = 'Select at least one activity, or add your own below.';
      break;
    }
    case 'systems': {
      const count =
        input.systems.selectedSystemIds.length + input.systems.customSystems.length;
      if (count === 0)
        errors['systems-selection'] = 'Select at least one system, or add your own below.';
      break;
    }
    case 'objectives': {
      if (input.objectives.selectedObjectiveIds.length === 0)
        errors['objectives-selection'] = 'Select at least one objective — objectives change how opportunities are ranked.';
      break;
    }
    case 'readiness':
    default:
      break;
  }

  return errors;
}

export function AdvisorProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppView>('landing');
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState<AssessmentInput>(() => clone(DEMO_ASSESSMENT));
  const [isDemoData, setIsDemoData] = useState(true);
  const [baseMap, setBaseMap] = useState<TransformationMap | null>(null);
  const [overrides, setOverrides] = useState<DriverOverrides>({});
  const [handedOffWorkerId, setHandedOffWorkerId] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const totalHeadcount = useMemo(
    () => input.workforce.units.reduce((acc, u) => acc + (u.headcount || 0), 0),
    [input.workforce.units],
  );

  const stepId = ASSESSMENT_STEPS[stepIndex].id;

  const fieldErrors = useMemo(
    () => validateStep(stepId, input, totalHeadcount),
    [stepId, input, totalHeadcount],
  );
  const isStepValid = Object.keys(fieldErrors).length === 0;

  /**
   * The map the UI renders. Rebuilt whenever an assumption is adjusted, so the
   * opportunity figures, worker values and headline total can never disagree
   * with the drivers behind them.
   */
  const map = useMemo(() => {
    if (!baseMap) return null;
    return deriveMap(baseMap.input, overrides, baseMap.generatedAt);
  }, [baseMap, overrides]);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const actions: AdvisorActions = useMemo(
    () => ({
      goTo: (next) => {
        setView(next);
        scrollTop();
      },
      startAssessment: (options) => {
        if (options?.prefill === false) {
          setInput(clone(EMPTY_ASSESSMENT));
          setIsDemoData(false);
        }
        setStepIndex(0);
        setShowErrors(false);
        setView('assessment');
        scrollTop();
      },
      tryContinue: () => {
        const errors = validateStep(stepId, input, totalHeadcount);
        if (Object.keys(errors).length > 0) {
          setShowErrors(true);
          return;
        }
        setShowErrors(false);
        setStepIndex((i) => Math.min(i + 1, ASSESSMENT_STEPS.length - 1));
        scrollTop();
      },
      previousStep: () => {
        // Entered data is held in state, so going back never loses answers.
        setShowErrors(false);
        setStepIndex((i) => Math.max(i - 1, 0));
        scrollTop();
      },
      goToStep: (index) => {
        setShowErrors(false);
        setStepIndex(Math.max(0, Math.min(index, ASSESSMENT_STEPS.length - 1)));
        scrollTop();
      },
      loadDemoData: () => {
        setInput(clone(DEMO_ASSESSMENT));
        setIsDemoData(true);
        setShowErrors(false);
      },
      clearAssessment: () => {
        setInput(clone(EMPTY_ASSESSMENT));
        setIsDemoData(false);
        setShowErrors(false);
      },
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
      updateReadiness: (key, value) =>
        setInput((s) => ({
          ...s,
          readiness: { ...s.readiness, [key]: value },
        })),
      runAnalysis: async () => {
        setView('analysis');
        setOverrides({});
        scrollTop();
        const result = await generateTransformationMap(input);
        setBaseMap(result);
      },
      completeAnalysis: () => {
        setView('results');
        scrollTop();
      },
      markHandedOff: (workerId) => setHandedOffWorkerId(workerId),
      setDriverOverride: (opportunityId, driverId, value) =>
        setOverrides((o) => ({
          ...o,
          [opportunityId]: { ...o[opportunityId], [driverId]: value },
        })),
      resetOpportunityOverrides: (opportunityId) =>
        setOverrides((o) => {
          const next = { ...o };
          delete next[opportunityId];
          return next;
        }),
      resetAllOverrides: () => setOverrides({}),
      reset: () => {
        setInput(clone(DEMO_ASSESSMENT));
        setIsDemoData(true);
        setBaseMap(null);
        setOverrides({});
        setStepIndex(0);
        setShowErrors(false);
        setHandedOffWorkerId(null);
        setView('landing');
        scrollTop();
      },
    }),
    [input, stepId, totalHeadcount, scrollTop],
  );

  const value = useMemo(
    () => ({
      view,
      stepIndex,
      input,
      map,
      handedOffWorkerId,
      isDemoData,
      overrides,
      actions,
      totalHeadcount,
      stepId,
      isStepValid,
      fieldErrors,
      showErrors,
    }),
    [
      view,
      stepIndex,
      input,
      map,
      handedOffWorkerId,
      isDemoData,
      overrides,
      actions,
      totalHeadcount,
      stepId,
      isStepValid,
      fieldErrors,
      showErrors,
    ],
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
