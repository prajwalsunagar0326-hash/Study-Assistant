import { useState, useRef, useCallback, useEffect } from 'react';
import { StudyPlan, StudyMode, ApiError } from '../types/study';
import { generateStudyPlanApi } from '../lib/api';

export type LoadingStage =
  | 'reading'
  | 'identifying'
  | 'building'
  | 'validating';

export interface UseStudyGenerationReturn {
  studyPlan: StudyPlan | null;
  mode: StudyMode;
  setMode: (mode: StudyMode) => void;
  isLoading: boolean;
  loadingStage: LoadingStage;
  error: ApiError | null;
  lastPrompt: string;
  generate: (prompt: string, selectedMode?: StudyMode) => Promise<void>;
  cancelGeneration: () => void;
  retry: () => Promise<void>;
  resetToNewTopic: () => void;
  setStudyPlan: React.Dispatch<React.SetStateAction<StudyPlan | null>>;
}

export function useStudyGeneration(): UseStudyGenerationReturn {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [mode, setMode] = useState<StudyMode>('flashcards');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('reading');
  const [error, setError] = useState<ApiError | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');

  // Stale request protection: increment counter for each invocation
  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const stageTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const clearStageTimeouts = () => {
    stageTimeoutRef.current.forEach((t) => clearTimeout(t));
    stageTimeoutRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearStageTimeouts();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearStageTimeouts();
    setIsLoading(false);
  }, []);

  const generate = useCallback(
    async (prompt: string, selectedMode?: StudyMode) => {
      const activeMode = selectedMode || mode;
      if (selectedMode) {
        setMode(selectedMode);
      }

      setLastPrompt(prompt);
      setError(null);
      setIsLoading(true);
      setLoadingStage('reading');
      clearStageTimeouts();

      // 1. Abort any previous pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 2. Increment request ID guard
      requestIdRef.current += 1;
      const currentRequestId = requestIdRef.current;

      // 3. Create fresh AbortController
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // UX Progressive messaging stages (presentation only, not faking backend progress)
      const t1 = setTimeout(() => {
        if (requestIdRef.current === currentRequestId) {
          setLoadingStage('identifying');
        }
      }, 700);

      const t2 = setTimeout(() => {
        if (requestIdRef.current === currentRequestId) {
          setLoadingStage('building');
        }
      }, 1400);

      const t3 = setTimeout(() => {
        if (requestIdRef.current === currentRequestId) {
          setLoadingStage('validating');
        }
      }, 2100);

      stageTimeoutRef.current = [t1, t2, t3];

      try {
        const result = await generateStudyPlanApi(prompt, activeMode, controller.signal);

        // Guard against race conditions: if a newer request began, discard this result!
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        clearStageTimeouts();
        setIsLoading(false);

        if (result.success) {
          setStudyPlan(result.data);
          setError(null);
        } else {
          // If aborted by user / newer request, don't show error
          if (result.error.type === 'ABORTED') {
            return;
          }
          setError(result.error);
        }
      } catch (err) {
        if (currentRequestId !== requestIdRef.current) {
          return;
        }
        clearStageTimeouts();
        setIsLoading(false);
        setError({
          type: 'UNKNOWN',
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    },
    [mode]
  );

  const retry = useCallback(async () => {
    if (lastPrompt) {
      await generate(lastPrompt, mode);
    }
  }, [lastPrompt, mode, generate]);

  const resetToNewTopic = useCallback(() => {
    cancelGeneration();
    setStudyPlan(null);
    setError(null);
    setLastPrompt('');
  }, [cancelGeneration]);

  return {
    studyPlan,
    mode,
    setMode,
    isLoading,
    loadingStage,
    error,
    lastPrompt,
    generate,
    cancelGeneration,
    retry,
    resetToNewTopic,
    setStudyPlan,
  };
}
