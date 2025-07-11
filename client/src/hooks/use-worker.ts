/**
 * Web Worker Hook
 * 
 * React hooks for using web workers to offload CPU-intensive tasks
 * from the main thread, improving application responsiveness.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import workerManager, {
  performComplexCalculation,
  performMatrixOperation,
  processData,
  processImage,
  processAudio
} from '@/lib/worker-manager';

/**
 * Hook for using web workers with complex calculations
 * @param initialData Initial data to process
 * @param operation Operation to perform
 * @returns Hook API with loading state and execution function
 */
export function useComplexCalculation(
  initialData?: number[],
  initialOperation?: 'sum' | 'average' | 'max' | 'min' | 'median'
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Execute calculation
  const calculate = useCallback(async (
    data: number[],
    operation: 'sum' | 'average' | 'max' | 'min' | 'median'
  ) => {
    setLoading(true);
    setError(null);
    startTimeRef.current = performance.now();

    try {
      const result = await performComplexCalculation(data, operation);
      setResult(result);
      const endTime = performance.now();
      setProcessingTime(endTime - startTimeRef.current);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize if initial data provided
  useEffect(() => {
    if (initialData && initialOperation) {
      calculate(initialData, initialOperation).catch(err => {
        console.error('Initial calculation failed:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    result,
    processingTime,
    calculate
  };
}

/**
 * Hook for using web workers with matrix operations
 * @param initialMatrices Initial matrices to process
 * @param initialOperation Operation to perform
 * @returns Hook API with loading state and execution function
 */
export function useMatrixOperation(
  initialMatrices?: number[][][],
  initialOperation?: 'multiply' | 'transpose' | 'inverse'
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<number[][] | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Execute matrix operation
  const executeOperation = useCallback(async (
    matrices: number[][][],
    operation: 'multiply' | 'transpose' | 'inverse'
  ) => {
    setLoading(true);
    setError(null);
    startTimeRef.current = performance.now();

    try {
      const result = await performMatrixOperation(matrices, operation);
      setResult(result);
      const endTime = performance.now();
      setProcessingTime(endTime - startTimeRef.current);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize if initial data provided
  useEffect(() => {
    if (initialMatrices && initialOperation) {
      executeOperation(initialMatrices, initialOperation).catch(err => {
        console.error('Initial matrix operation failed:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    result,
    processingTime,
    executeOperation
  };
}

/**
 * Hook for using web workers with data processing
 * @param initialData Initial data to process
 * @param initialTransformations Initial transformations to apply
 * @returns Hook API with loading state and execution function
 */
export function useDataProcessing<T = any>(
  initialData?: unknown[],
  initialTransformations?: string[]
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<T[] | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Execute data processing
  const processDataWithWorker = useCallback(async (
    data: unknown[],
    transformations: string[]
  ) => {
    setLoading(true);
    setError(null);
    startTimeRef.current = performance.now();

    try {
      const result = await processData<T>(data, transformations);
      setResult(result);
      const endTime = performance.now();
      setProcessingTime(endTime - startTimeRef.current);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize if initial data provided
  useEffect(() => {
    if (initialData && initialTransformations) {
      processDataWithWorker(initialData, initialTransformations).catch(err => {
        console.error('Initial data processing failed:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    result,
    processingTime,
    processData: processDataWithWorker
  };
}

/**
 * Hook for using web workers with image processing
 * @param initialImageData Initial image data to process
 * @param initialFilters Initial filters to apply
 * @returns Hook API with loading state and execution function
 */
export function useImageProcessing(
  initialImageData?: ImageData,
  initialFilters?: string[]
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ImageData | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Execute image processing
  const processImageWithWorker = useCallback(async (
    imageData: ImageData,
    filters: string[]
  ) => {
    setLoading(true);
    setError(null);
    startTimeRef.current = performance.now();

    try {
      const result = await processImage(imageData, filters);
      setResult(result);
      const endTime = performance.now();
      setProcessingTime(endTime - startTimeRef.current);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize if initial data provided
  useEffect(() => {
    if (initialImageData && initialFilters) {
      processImageWithWorker(initialImageData, initialFilters).catch(err => {
        console.error('Initial image processing failed:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    result,
    processingTime,
    processImage: processImageWithWorker
  };
}

/**
 * Hook for using web workers with audio processing
 * @param initialAudioData Initial audio data to process
 * @param initialSampleRate Initial sample rate
 * @param initialOperation Initial operation to perform
 * @returns Hook API with loading state and execution function
 */
export function useAudioProcessing(
  initialAudioData?: Float32Array,
  initialSampleRate?: number,
  initialOperation?: string
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<Float32Array | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Execute audio processing
  const processAudioWithWorker = useCallback(async (
    audioData: Float32Array,
    sampleRate: number,
    operation: string
  ) => {
    setLoading(true);
    setError(null);
    startTimeRef.current = performance.now();

    try {
      const result = await processAudio(audioData, sampleRate, operation);
      setResult(result);
      const endTime = performance.now();
      setProcessingTime(endTime - startTimeRef.current);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize if initial data provided
  useEffect(() => {
    if (initialAudioData && initialSampleRate && initialOperation) {
      processAudioWithWorker(initialAudioData, initialSampleRate, initialOperation).catch(err => {
        console.error('Initial audio processing failed:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    result,
    processingTime,
    processAudio: processAudioWithWorker
  };
}

/**
 * Hook for initializing the worker manager
 * @returns Loading state and stats
 */
export function useWorkerManager() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState(workerManager.getStats());

  // Initialize worker manager
  const initialize = useCallback(async () => {
    if (initialized) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await workerManager.initialize();
      setInitialized(true);
      setStats(workerManager.getStats());
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // Terminate worker manager
  const terminate = useCallback(() => {
    workerManager.terminate();
    setInitialized(false);
    setStats(workerManager.getStats());
  }, []);

  // Update stats periodically
  useEffect(() => {
    if (!initialized) return;
    
    const intervalId = setInterval(() => {
      setStats(workerManager.getStats());
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [initialized]);

  return {
    loading,
    error,
    stats,
    initialized,
    initialize,
    terminate
  };
}