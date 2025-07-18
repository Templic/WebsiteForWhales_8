/**
 * Computation Web Worker
 * 
 * This worker handles CPU-intensive calculations to keep the main thread responsive.
 * Web Workers run in a separate thread and communicate with the main thread via messages.
 */

// Define message types for type safety
type ComputationTask = 
  | { type: 'COMPLEX_CALCULATION'; data: number[]; operation: 'sum' | 'average' | 'max' | 'min' | 'median' }
  | { type: 'MATRIX_OPERATION'; matrices: number[][][]; operation: 'multiply' | 'transpose' | 'inverse' }
  | { type: 'DATA_PROCESSING'; rawData: unknown[]; transformations: string[] }
  | { type: 'IMAGE_PROCESSING'; imageData: ImageData; filters: string[] }
  | { type: 'AUDIO_PROCESSING'; audioData: Float32Array; sampleRate: number; operation: string };

type WorkerResponse = {
  taskId?: string;
  type: string;
  result: unknown;
  error?: string;
  processingTime?: number;
};

// Set up event listener for messages from main thread
self.addEventListener('message', (event: MessageEvent<ComputationTask & { taskId?: string }>) => {
  if (!event.data) return;
  
  const task = event.data;
  const taskId = task.taskId;
  const startTime = performance.now();
  
  try {
    let result: unknown;
    
    switch (task.type) {
      case 'COMPLEX_CALCULATION':
        result = performComplexCalculation(task.data, task.operation);
        break;
        
      case 'MATRIX_OPERATION':
        result = performMatrixOperation(task.matrices, task.operation);
        break;
        
      case 'DATA_PROCESSING':
        result = processData(task.rawData, task.transformations);
        break;
        
      case 'IMAGE_PROCESSING':
        result = processImage(task.imageData, task.filters);
        break;
        
      case 'AUDIO_PROCESSING':
        result = processAudio(task.audioData, task.sampleRate, task.operation);
        break;
        
      default:
        throw new Error(`Unknown task type: ${(task as unknown).type}`);
    }
    
    const processingTime = performance.now() - startTime;
    
    // Send result back to main thread
    const response: WorkerResponse = {
      taskId,
      type: task.type,
      result,
      processingTime
    };
    
    self.postMessage(response);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    
    // Send error back to main thread
    const errorResponse: WorkerResponse = {
      taskId,
      type: task.type,
      result: null,
      error,
      processingTime: performance.now() - startTime
    };
    
    self.postMessage(errorResponse);
  }
});

/**
 * Performs complex calculations on arrays of numbers
 * @param data Array of numbers to process
 * @param operation Type of operation to perform
 * @returns Result of the calculation
 */
function performComplexCalculation(data: number[], operation: string): number {
  // Ensure we have data to process
  if (!data || data.length === 0) {
    throw new Error('No data provided for calculation');
  }
  
  switch (operation) {
    case 'sum':
      return data.reduce((sum, value) => sum + value, 0);
      
    case 'average':
      return data.reduce((sum, value) => sum + value, 0) / data.length;
      
    case 'max':
      return Math.max(...data);
      
    case 'min':
      return Math.min(...data);
      
    case 'median': {
      // Sort the array
      const sorted = [...data].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      
      // If even length, average the two middle values, otherwise return the middle value
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    }
    
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

/**
 * Performs operations on matrices
 * @param matrices Array of matrices to operate on
 * @param operation Type of matrix operation to perform
 * @returns Result matrix
 */
function performMatrixOperation(matrices: number[][][], operation: string): number[][] {
  switch (operation) {
    case 'multiply': {
      if (matrices.length < 2) {
        throw new Error('At least two matrices are required for multiplication');
      }
      
      let result = matrices[0];
      
      for (let m = 1; m < matrices.length; m++) {
        const matrixA = result;
        const matrixB = matrices[m];
        
        // Check if matrices can be multiplied
        if (matrixA[0].length !== matrixB.length) {
          throw new Error('Matrices cannot be multiplied: dimensions mismatch');
        }
        
        // Initialize result matrix
        const newResult: number[][] = [];
        for (let i = 0; i < matrixA.length; i++) {
          newResult[i] = [];
          for (let j = 0; j < matrixB[0].length; j++) {
            newResult[i][j] = 0;
            for (let k = 0; k < matrixB.length; k++) {
              newResult[i][j] += matrixA[i][k] * matrixB[k][j];
            }
          }
        }
        
        result = newResult;
      }
      
      return result;
    }
    
    case 'transpose': {
      if (matrices.length === 0) {
        throw new Error('No matrix provided for transpose operation');
      }
      
      const matrix = matrices[0];
      const rows = matrix.length;
      const cols = matrix[0].length;
      
      // Initialize transposed matrix
      const result: number[][] = [];
      for (let j = 0; j < cols; j++) {
        result[j] = [];
        for (let i = 0; i < rows; i++) {
          result[j][i] = matrix[i][j];
        }
      }
      
      return result;
    }
    
    default:
      throw new Error(`Unknown matrix operation: ${operation}`);
  }
}

/**
 * Processes raw data with transformations
 * @param rawData Array of raw data objects
 * @param transformations Array of transformation operations to apply
 * @returns Transformed data
 */
function processData(rawData: unknown[], transformations: string[]): unknown[] {
  if (!rawData || rawData.length === 0) {
    return [];
  }
  
  let processedData = [...rawData];
  
  for (const transformation of transformations) {
    switch (transformation) {
      case 'filter_nulls':
        processedData = processedData.filter(item => item !== null && item !== undefined);
        break;
        
      case 'sort_ascending':
        processedData = processedData.sort((a, b) => {
          if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
          }
          return String(a).localeCompare(String(b));
        });
        break;
        
      case 'sort_descending':
        processedData = processedData.sort((a, b) => {
          if (typeof a === 'number' && typeof b === 'number') {
            return b - a;
          }
          return String(b).localeCompare(String(a));
        });
        break;
        
      case 'remove_duplicates':
        processedData = [...new Set(processedData)];
        break;
        
      default:
        throw new Error(`Unknown transformation: ${transformation}`);
    }
  }
  
  return processedData;
}

/**
 * Processes image data with various filters
 * @param imageData Raw image data to process
 * @param filters Array of filters to apply
 * @returns Processed image data
 */
function processImage(imageData: ImageData, filters: string[]): ImageData {
  // Create a copy of the image data to avoid modifying the original
  const width = imageData.width;
  const height = imageData.height;
  const processedData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    width,
    height
  );
  
  for (const filter of filters) {
    const data = processedData.data;
    
    switch (filter) {
      case 'grayscale': {
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;        // Red
          data[i + 1] = avg;    // Green
          data[i + 2] = avg;    // Blue
          // Alpha channel remains unchanged
        }
        break;
      }
      
      case 'invert': {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];         // Red
          data[i + 1] = 255 - data[i + 1]; // Green
          data[i + 2] = 255 - data[i + 2]; // Blue
          // Alpha channel remains unchanged
        }
        break;
      }
      
      case 'sepia': {
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));      // Red
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));  // Green
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));  // Blue
          // Alpha channel remains unchanged
        }
        break;
      }
      
      default:
        throw new Error(`Unknown image filter: ${filter}`);
    }
  }
  
  return processedData;
}

/**
 * Processes audio data with various operations
 * @param audioData Audio sample data
 * @param sampleRate Sample rate of the audio data
 * @param operation Audio processing operation to perform
 * @returns Processed audio data
 */
function processAudio(audioData: Float32Array, sampleRate: number, operation: string): Float32Array {
  // Create a copy of the audio data to avoid modifying the original
  const processedData = new Float32Array(audioData);
  
  switch (operation) {
    case 'normalize': {
      // Find the maximum absolute value
      let maxValue = 0;
      for (let i = 0; i < processedData.length; i++) {
        maxValue = Math.max(maxValue, Math.abs(processedData[i]));
      }
      
      // Normalize to [-1, 1]
      if (maxValue > 0) {
        const normalizationFactor = 1 / maxValue;
        for (let i = 0; i < processedData.length; i++) {
          processedData[i] *= normalizationFactor;
        }
      }
      break;
    }
    
    case 'reverse': {
      // Reverse the audio data
      const length = processedData.length;
      for (let i = 0; i < Math.floor(length / 2); i++) {
        const temp = processedData[i];
        processedData[i] = processedData[length - 1 - i];
        processedData[length - 1 - i] = temp;
      }
      break;
    }
    
    case 'fade_in': {
      // Apply a linear fade-in to the first 10% of the audio
      const fadeLength = Math.floor(processedData.length * 0.1);
      for (let i = 0; i < fadeLength; i++) {
        const factor = i / fadeLength;
        processedData[i] *= factor;
      }
      break;
    }
    
    case 'fade_out': {
      // Apply a linear fade-out to the last 10% of the audio
      const fadeLength = Math.floor(processedData.length * 0.1);
      const startIndex = processedData.length - fadeLength;
      for (let i = 0; i < fadeLength; i++) {
        const factor = 1 - (i / fadeLength);
        processedData[startIndex + i] *= factor;
      }
      break;
    }
    
    default:
      throw new Error(`Unknown audio operation: ${operation}`);
  }
  
  return processedData;
}

// Self is a reference to the worker's global scope
self.postMessage({ type: 'WORKER_READY', result: 'Computation worker initialized and ready' });