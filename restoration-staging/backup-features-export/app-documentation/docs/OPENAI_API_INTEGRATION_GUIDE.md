# OpenAI API Integration Gu

i

d e how to securely integrate with OpenAI APIs while maintaining proper security practices.

## Security Considerations When integrating with OpenAI APIs, consider the following security aspects: 1. **API Key Management**: Securely store and access API key s 2. **Rate Limiting**: Implement proper rate limit handling 3. **Error Handling**: Gracefully handle API errors 4. **Fallback Mechanisms**: Provide alternatives when API is unavailable 5. **User Data Privacy**: Be careful with data sent to the API 6. **Response Validation**: Always validate and sanitize response

s

## API Key Management ### Server-Side API Key Storage Always store API keys on the server, never expose them in client-side cod

e:

```typescript

// server/config/api-keys.ts

import * as dotenv from 'dotenv';

dotenv.config();

// Securely access API keys from environment variables

export const getOpenAIKey = (): string => {
 const apiKey = process.env.OPENAI_API_KEY;

 if (!apiKey) {
 console.error('OpenAI API key is not configured');
 throw new Error('OpenAI API key is not configured');
 }

 return apiKey;
};
``` ### API Key Rotation and Monitoring Implement a system to monitor API key usage and rotate keys when neede

d:

```typescript
// server/services/api-key-monitor.ts

import { securityLogger } from '../utils/logger';

interface KeyUsage {
 key: string;
 totalRequests: number;
 lastUsed: Date;
 costIncurred: number;
}

const keyUsageMap = new Map<string, KeyUsage>();

export function trackAPIKeyUsage(
 keyIdentifier: string,
 requestCost: number = 1
): void {
 const usage = keyUsageMap.get(keyIdentifier) || {
 key: keyIdentifier,
 totalRequests: 0,
 lastUsed: new Date(),
 costIncurred: 0
 };

 usage.totalRequests += 1;
 usage.lastUsed = new Date();
 usage.costIncurred += requestCost;

 keyUsageMap.set(keyIdentifier, usage);

 // Alert on high usage
 if (usage.totalRequests % 100 === 0) {
 securityLogger.logSecurityEvent({
 type: 'api_key_usage_threshold',
 details: {
 keyIdentifier,
 totalRequests: usage.totalRequests,
 costIncurred: usage.costIncurred
 },
 severity: 'medium'
 });
 }
}

export function getKeyUsageReport(): KeyUsage[] {
 return Array.from(keyUsageMap.values());
}
```

## Secure OpenAI Integration Pattern ### Server-Side Implementation Create a secure server-side API endpoint that communicates with OpenA

I:

```typescript

// server/services/openai-service.ts

import OpenAI from 'openai';

import { getOpenAIKey } from '../config/api-keys';

import { trackAPIKeyUsage } from './api-key-monitor';

import { securityLogger } from '../utils/logger';

// Initialize OpenAI client

let openaiClient: OpenAI | null = null;

// Get or create OpenAI client

function getOpenAIClient(): OpenAI {
 if (!openaiClient) {
 try {
 const apiKey = getOpenAIKey();
 openaiClient = new OpenAI({ apiKey });
 } catch (error) {
 securityLogger.logSecurityEvent({
 type: 'openai_client_init_error',
 details: { error: error.message },
 severity: 'high'
 });
 throw error;
 }
 }

 return openaiClient;
}

// Calculate token estimation (rough estimate)

function estimateTokens(text: string): number {
 // A very rough estimate - OpenAI suggests ~4 chars per token
 return Math.ceil(text.length / 4);
}

// Calculate request cost (for monitoring)

function calculateRequestCost(
 modelName: string,
 inputTokens: number,
 outputTokens: number = 0
): number {
 // These are approximate costs - check OpenAI's pricing page for actual rates
 const rates: Record<string, { input: number, output: number }> = {
 'gpt-4o': { input: 0.00005, output: 0.00015 },
 'gpt-4': { input: 0.00003, output: 0.00006 },
 'gpt-3.5-turbo': { input: 0.0000015, output: 0.000002 }
 };

 const modelRate = rates[modelName] || rates['gpt-3.5-turbo'];

 return (inputTokens * modelRate.input) + (outputTokens * modelRate.output);
}

/**
 * Make a secure text completion request to OpenAI
 */

export async function generateTextCompletion(
 prompt: string,
 options: {
 model?: string;
 maxTokens?: number;
 temperature?: number;
 shouldTrackUsage?: boolean;
 } = {}
): Promise<{
 text: string | null;
 error: string | null;
 model: string;
 promptTokens: number;
 completionTokens: number;
}> {
 // Default options
 const {
 model = 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
 maxTokens = 500,
 temperature = 0.7,
 shouldTrackUsage = true
 } = options;

 try {
 // Log API request
 securityLogger.logSecurityEvent({
 type: 'openai_api_request',
 details: {
 model,
 promptLength: prompt.length,
 estimatedTokens: estimateTokens(prompt)
 },
 severity: 'info'
 });

 // Get OpenAI client
 const openai = getOpenAIClient();

 // Estimate tokens for tracking
 const estimatedPromptTokens = estimateTokens(prompt);

 // Make API request
 const completion = await openai.chat.completions.create({
 model,
 messages: [{ role: "user", content: prompt }],
 max_tokens: maxTokens,
 temperature,
 });

 // Track API key usage
 if (shouldTrackUsage) {
 const usageCost = calculateRequestCost(
 model,
 completion.usage?.prompt_tokens || estimatedPromptTokens,
 completion.usage?.completion_tokens || 0
 );

 trackAPIKeyUsage('openai', usageCost);
 }

 // Return result
 return {
 text: completion.choices[0].message.content,
 error: null,
 model: completion.model,
 promptTokens: completion.usage?.prompt_tokens || estimatedPromptTokens,
 completionTokens: completion.usage?.completion_tokens || 0
 };
 } catch (error) {
 // Log error
 securityLogger.logSecurityEvent({
 type: 'openai_api_error',
 details: {
 error: error.message,
 model
 },
 severity: 'medium'
 });

 // Return error
 return {
 text: null,
 error: error.message || 'An error occurred while generating text',
 model,
 promptTokens: estimateTokens(prompt),
 completionTokens: 0
 };
 }
}

/**
 * Generate an image using DALL-E
 */

export async function generateImage(
 prompt: string,
 options: {
 size?: '256x256' | '512x512' | '1024x1024';
 quality?: 'standard' | 'hd';
 shouldTrackUsage?: boolean;
 } = {}
): Promise<{
 imageUrl: string | null;
 error: string | null;
}> {
 // Default options
 const {
 size = '1024x1024',
 quality = 'standard',
 shouldTrackUsage = true
 } = options;

 try {
 // Log API request
 securityLogger.logSecurityEvent({
 type: 'openai_image_request',
 details: {
 promptLength: prompt.length,
 size,
 quality
 },
 severity: 'info'
 });

 // Get OpenAI client
 const openai = getOpenAIClient();

 // Make API request
 const result = await openai.images.generate({
 model: "dall-e-3",
 prompt,
 n: 1,
 size,
 quality,
 response_format: 'url',
 });

 // Track API key usage (approximate cost based on size/quality)
 if (shouldTrackUsage) {
 const costMap = {
 '256x256': 0.016,
 '512x512': 0.018,
 '1024x1024': 0.02,
 };
 const baseCost = costMap[size] || 0.02;
 const qualityMultiplier = quality === 'hd' ? 2 : 1;

 trackAPIKeyUsage('openai-image', baseCost * qualityMultiplier);
 }

 // Return result
 return {
 imageUrl: result.data[0].url,
 error: null
 };
 } catch (error) {
 // Log error
 securityLogger.logSecurityEvent({
 type: 'openai_image_error',
 details: { error: error.message },
 severity: 'medium'
 });

 // Return error
 return {
 imageUrl: null,
 error: error.message || 'An error occurred while generating image'
 };
 }
}

/**
 * Process an uploaded image with GPT-4o Vision
 */

export async function analyzeImage(
 base64Image: string,
 prompt: string = "Describe this image in detail.",
 options: {
 maxTokens?: number;
 shouldTrackUsage?: boolean;
 } = {}
): Promise<{
 analysis: string | null;
 error: string | null;
}> {
 // Default options
 const {
 maxTokens = 300,
 shouldTrackUsage = true
 } = options;

 try {
 // Log API request (without the image content)
 securityLogger.logSecurityEvent({
 type: 'openai_vision_request',
 details: {
 promptLength: prompt.length,
 imageSize: Math.ceil(base64Image.length / 1000) + 'KB'
 },
 severity: 'info'
 });

 // Get OpenAI client
 const openai = getOpenAIClient();

 // Make API request
 const response = await openai.chat.completions.create({
 model: "gpt-4o",
 max_tokens: maxTokens,
 messages: [
 {
 role: "user",
 content: [
 { type: "text", text: prompt },
 {
 type: "image_url",
 image_url: {
 url: `data:image/jpeg;base64,${base64Image}`
 }
 }
 ],
 },
 ],
 });

 // Track API key usage (approximate cost)
 if (shouldTrackUsage) {
 // Vision requests are more expensive
 const estimatedCost = 0.01; // This is a simplification
 trackAPIKeyUsage('openai-vision', estimatedCost);
 }

 // Return result
 return {
 analysis: response.choices[0].message.content,
 error: null
 };
 } catch (error) {
 // Log error
 securityLogger.logSecurityEvent({
 type: 'openai_vision_error',
 details: { error: error.message },
 severity: 'medium'
 });

 // Return error
 return {
 analysis: null,
 error: error.message || 'An error occurred while analyzing image'
 };
 }
}
``` ### Express API Routes Create API routes for the OpenAI servic

e:

```typescript
// server/routes/api/ai.ts

import express from 'express';

import {
 generateTextCompletion,
 generateImage,
 analyzeImage
} from '../../services/openai-service';

import { rateLimit } from 'express-rate-limit';

import fileUpload from 'express-fileupload';

import { securityLogger } from '../../utils/logger';

const router = express.Router();

// Apply stricter rate limits for AI endpoints

const aiRateLimit = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 50, // 50 requests per 15 minutes
 standardHeaders: true,
 message: { success: false, error: 'Rate limit exceeded for AI operations' }
});

// Apply rate limits to all AI routes

router.use(aiRateLimit);

// Enable file uploads for image analysis

router.use(fileUpload({
 limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
 abortOnLimit: true,
 responseOnLimit: JSON.stringify({
 success: false,
 error: 'File size limit exceeded (5MB maximum)'
 })
}));

// POST /api/ai/completion - Generate text completion

router.post('/completion', async (req, res) => {
 try {
 const { prompt, model, maxTokens, temperature } = req.body;

 // Validate required fields
 if (!prompt || typeof prompt !== 'string') {
 return res.status(400).json({
 success: false,
 error: 'Prompt is required and must be a string'
 });
 }

 // Check prompt length
 if (prompt.length > 10000) {
 return res.status(400).json({
 success: false,
 error: 'Prompt exceeds maximum length (10,000 characters)'
 });
 }

 // Generate completion
 const result = await generateTextCompletion(prompt, {
 model: model || undefined,
 maxTokens: maxTokens || undefined,
 temperature: temperature || undefined
 });

 // Check for errors
 if (result.error) {
 return res.status(500).json({
 success: false,
 error: result.error
 });
 }

 // Return result
 return res.json({
 success: true,
 data: {
 text: result.text,
 model: result.model,
 usage: {
 promptTokens: result.promptTokens,
 completionTokens: result.completionTokens,
 totalTokens: result.promptTokens + result.completionTokens
 }
 }
 });
 } catch (error) {
 securityLogger.logSecurityEvent({
 type: 'ai_completion_endpoint_error',
 details: { error: error.message },
 severity: 'medium'
 });

 return res.status(500).json({
 success: false,
 error: 'An error occurred during text generation'
 });
 }
});

// POST /api/ai/image - Generate image

router.post('/image', async (req, res) => {
 try {
 const { prompt, size, quality } = req.body;

 // Validate required fields
 if (!prompt || typeof prompt !== 'string') {
 return res.status(400).json({
 success: false,
 error: 'Prompt is required and must be a string'
 });
 }

 // Check prompt length
 if (prompt.length > 4000) {
 return res.status(400).json({
 success: false,
 error: 'Prompt exceeds maximum length (4,000 characters)'
 });
 }

 // Generate image
 const result = await generateImage(prompt, {
 size: size || undefined,
 quality: quality || undefined
 });

 // Check for errors
 if (result.error) {
 return res.status(500).json({
 success: false,
 error: result.error
 });
 }

 // Return result
 return res.json({
 success: true,
 data: {
 imageUrl: result.imageUrl
 }
 });
 } catch (error) {
 securityLogger.logSecurityEvent({
 type: 'ai_image_endpoint_error',
 details: { error: error.message },
 severity: 'medium'
 });

 return res.status(500).json({
 success: false,
 error: 'An error occurred during image generation'
 });
 }
});

// POST /api/ai/vision - Analyze image

router.post('/vision', async (req, res) => {
 try {
 // Check if file was uploaded
 if (!req.files || !req.files.image) {
 return res.status(400).json({
 success: false,
 error: 'No image file uploaded'
 });
 }

 // Get image file and prompt
 const imageFile = req.files.image as fileUpload.UploadedFile;
 const { prompt } = req.body;

 // Validate file type
 const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
 if (!allowedTypes.includes(imageFile.mimetype)) {
 return res.status(400).json({
 success: false,
 error: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed'
 });
 }

 // Convert file to base64
 const base64Image = imageFile.data.toString('base64');

 // Analyze image
 const result = await analyzeImage(
 base64Image,
 prompt || "Describe this image in detail."
 );

 // Check for errors
 if (result.error) {
 return res.status(500).json({
 success: false,
 error: result.error
 });
 }

 // Return result
 return res.json({
 success: true,
 data: {
 analysis: result.analysis
 }
 });
 } catch (error) {
 securityLogger.logSecurityEvent({
 type: 'ai_vision_endpoint_error',
 details: { error: error.message },
 severity: 'medium'
 });

 return res.status(500).json({
 success: false,
 error: 'An error occurred during image analysis'
 });
 }
});

export default router;
```

## Client-Side Implementation Create a client-side hook to securely use the OpenAI API through your serve

r:

```tsx

// client/src/hooks/useOpenAI.ts

import { useState } from 'react';

interface CompletionOptions {
 model?: string;
 maxTokens?: number;
 temperature?: number;
}

interface ImageOptions {
 size?: '256x256' | '512x512' | '1024x1024';
 quality?: 'standard' | 'hd';
}

interface VisionOptions {
 maxTokens?: number;
}

// Text completion hook

export function useCompletion() {
 const [text, setText] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [tokenUsage, setTokenUsage] = useState<{
 promptTokens: number;
 completionTokens: number;
 totalTokens: number;
 } | null>(null);

 const generateCompletion = async (
 prompt: string,
 options: CompletionOptions = {}
 ) => {
 setLoading(true);
 setError(null);

 try {
 const response = await fetch('/api/ai/completion', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({
 prompt,
 ...options
 })
 });

 const data = await response.json();

 if (!response.ok || !data.success) {
 throw new Error(data.error || 'Failed to generate completion');
 }

 setText(data.data.text);
 setTokenUsage({
 promptTokens: data.data.usage.promptTokens,
 completionTokens: data.data.usage.completionTokens,
 totalTokens: data.data.usage.totalTokens
 });
 } catch (err: any) {
 setError(err.message || 'An error occurred');
 setText(null);
 } finally {
 setLoading(false);
 }
 };

 const reset = () => {
 setText(null);
 setError(null);
 setTokenUsage(null);
 };

 return {
 text,
 loading,
 error,
 tokenUsage,
 generateCompletion,
 reset
 };
}

// Image generation hook

export function useImageGeneration() {
 const [imageUrl, setImageUrl] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const generateImage = async (
 prompt: string,
 options: ImageOptions = {}
 ) => {
 setLoading(true);
 setError(null);

 try {
 const response = await fetch('/api/ai/image', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({
 prompt,
 ...options
 })
 });

 const data = await response.json();

 if (!response.ok || !data.success) {
 throw new Error(data.error || 'Failed to generate image');
 }

 setImageUrl(data.data.imageUrl);
 } catch (err: any) {
 setError(err.message || 'An error occurred');
 setImageUrl(null);
 } finally {
 setLoading(false);
 }
 };

 const reset = () => {
 setImageUrl(null);
 setError(null);
 };

 return {
 imageUrl,
 loading,
 error,
 generateImage,
 reset
 };
}

// Vision analysis hook

export function useVisionAnalysis() {
 const [analysis, setAnalysis] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const analyzeImage = async (
 imageFile: File,
 prompt?: string,
 options: VisionOptions = {}
 ) => {
 setLoading(true);
 setError(null);

 try {
 // Create form data
 const formData = new FormData();
 formData.append('image', imageFile);

 if (prompt) {
 formData.append('prompt', prompt);
 }

 if (options.maxTokens) {
 formData.append('maxTokens', options.maxTokens.toString());
 }

 // Make request
 const response = await fetch('/api/ai/vision', {
 method: 'POST',
 body: formData
 });

 const data = await response.json();

 if (!response.ok || !data.success) {
 throw new Error(data.error || 'Failed to analyze image');
 }

 setAnalysis(data.data.analysis);
 } catch (err: any) {
 setError(err.message || 'An error occurred');
 setAnalysis(null);
 } finally {
 setLoading(false);
 }
 };

 const reset = () => {
 setAnalysis(null);
 setError(null);
 };

 return {
 analysis,
 loading,
 error,
 analyzeImage,
 reset
 };
}
```

## React Component Examples ### Text Completion Componen

t

```tsx

// client/src/components/ai/TextCompletionForm.tsx

import React, { useState } from 'react';

import { useCompletion } from '../../hooks/useOpenAI';

// Optional model selector component

const ModelSelector: React.FC<{
 selectedModel: string;
 onChange: (model: string) => void;
}> = ({ selectedModel, onChange }) => {
 return (
 <div className="mb-4">
 <label className="block text-sm font-medium mb-1">
 AI Model
 </label>
 <select
 className="w-full border rounded-lg p-2"
 value={selectedModel}
 onChange={(e) => onChange(e.target.value)}
 >
 <option value="gpt-4o">GPT-4o (Latest)</option>
 <option value="gpt-4">GPT-4</option>
 <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
 </select>
 </div>
 );
};

const TextCompletionForm: React.FC = () => {
 // States
 const [prompt, setPrompt] = useState('');
 const [model, setModel] = useState('gpt-4o');
 const [temperature, setTemperature] = useState(0.7);
 const [maxTokens, setMaxTokens] = useState(500);

 // Use OpenAI completion hook
 const {
 text,
 loading,
 error,
 tokenUsage,
 generateCompletion,
 reset
 } = useCompletion();

 // Handle form submission
 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();

 if (!prompt.trim()) {
 return;
 }

 generateCompletion(prompt, {
 model,
 temperature,
 maxTokens
 });
 };

 return (
 <div className="max-w-3xl mx-auto">
 <h2 className="text-2xl font-bold mb-6">AI Text Generation</h2>

 <form onSubmit={handleSubmit}>
 <div className="mb-4">
 <label className="block text-sm font-medium mb-1">
 Prompt
 </label>
 <textarea
 className="w-full border rounded-lg p-3 h-32"
 value={prompt}
 onChange={(e) => setPrompt(e.target.value)}
 placeholder="Enter your prompt here..."
 />
 </div>

 <ModelSelector
 selectedModel={model}
 onChange={setModel}
 />

 <div className="grid grid-cols-2 gap-4 mb-6">
 <div>
 <label className="block text-sm font-medium mb-1">
 Temperature: {temperature}
 </label>
 <input
 type="range"
 min="0"
 max="1"
 step="0.1"
 value={temperature}
 onChange={(e) => setTemperature(parseFloat(e.target.value))}
 className="w-full"
 />
 <div className="flex justify-between text-xs text-gray-500">
 <span>Precise</span>
 <span>Creative</span>
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium mb-1">
 Max Tokens: {maxTokens}
 </label>
 <input
 type="range"
 min="50"
 max="2000"
 step="50"
 value={maxTokens}
 onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
 className="w-full"
 />
 <div className="flex justify-between text-xs text-gray-500">
 <span>Shorter</span>
 <span>Longer</span>
 </div>
 </div>
 </div>

 <div className="flex space-x-3">
 <button
 type="submit"
 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
 disabled={loading || !prompt.trim()}
 >
 {loading ? 'Generating...' : 'Generate Text'}
 </button>

 <button
 type="button"
 className="px-4 py-2 border border-gray-300 rounded-lg"
 onClick={reset}
 disabled={loading}
 >
 Reset
 </button>
 </div>
 </form>

 {error && (
 <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
 Error: {error}
 </div>
 )}

 {text && (
 <div className="mt-6">
 <h3 className="text-lg font-medium mb-2">Generated Text</h3>
 <div className="p-4 bg-gray-50 border rounded-lg whitespace-pre-wrap">
 {text}
 </div>

 {tokenUsage && (
 <div className="mt-2 text-sm text-gray-500">
 Tokens used: {tokenUsage.totalTokens} (Prompt: {tokenUsage.promptTokens}, Completion: {tokenUsage.completionTokens})
 </div>
 )}
 </div>
 )}
 </div>
 );
};

export default TextCompletionForm;
``` ### Image Generation Componen

t

```tsx
// client/src/components/ai/ImageGenerationForm.tsx

import React, { useState } from 'react';

import { useImageGeneration } from '../../hooks/useOpenAI';

const ImageGenerationForm: React.FC = () => {
 // States
 const [prompt, setPrompt] = useState('');
 const [size, setSize] = useState<'256x256' | '512x512' | '1024x1024'>('1024x1024');
 const [quality, setQuality] = useState<'standard' | 'hd'>('standard');

 // Use image generation hook
 const {
 imageUrl,
 loading,
 error,
 generateImage,
 reset
 } = useImageGeneration();

 // Handle form submission
 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();

 if (!prompt.trim()) {
 return;
 }

 generateImage(prompt, { size, quality });
 };

 return (
 <div className="max-w-3xl mx-auto">
 <h2 className="text-2xl font-bold mb-6">AI Image Generation</h2>

 <form onSubmit={handleSubmit}>
 <div className="mb-4">
 <label className="block text-sm font-medium mb-1">
 Image Description
 </label>
 <textarea
 className="w-full border rounded-lg p-3 h-24"
 value={prompt}
 onChange={(e) => setPrompt(e.target.value)}
 placeholder="Describe the image you want to generate..."
 />
 </div>

 <div className="grid grid-cols-2 gap-4 mb-6">
 <div>
 <label className="block text-sm font-medium mb-1">
 Image Size
 </label>
 <select
 className="w-full border rounded-lg p-2"
 value={size}
 onChange={(e) => setSize(e.target.value as any)}
 >
 <option value="1024x1024">1024×1024</option>
 <option value="512x512">512×512</option>
 <option value="256x256">256×256</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium mb-1">
 Quality
 </label>
 <select
 className="w-full border rounded-lg p-2"
 value={quality}
 onChange={(e) => setQuality(e.target.value as any)}
 >
 <option value="standard">Standard</option>
 <option value="hd">HD</option>
 </select>
 </div>
 </div>

 <div className="flex space-x-3">
 <button
 type="submit"
 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
 disabled={loading || !prompt.trim()}
 >
 {loading ? 'Generating...' : 'Generate Image'}
 </button>

 <button
 type="button"
 className="px-4 py-2 border border-gray-300 rounded-lg"
 onClick={reset}
 disabled={loading}
 >
 Reset
 </button>
 </div>
 </form>

 {error && (
 <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
 Error: {error}
 </div>
 )}

 {imageUrl && (
 <div className="mt-6">
 <h3 className="text-lg font-medium mb-2">Generated Image</h3>
 <div className="border rounded-lg overflow-hidden">
 <img
 src={imageUrl}
 alt="AI generated image"
 className="max-w-full h-auto"
 />
 </div>
 </div>
 )}
 </div>
 );
};

export default ImageGenerationForm;
``` ### Vision Analysis Componen

t

```tsx
// client/src/components/ai/VisionAnalysisForm.tsx

import React, { useState } from 'react';

import { useVisionAnalysis } from '../../hooks/useOpenAI';

const VisionAnalysisForm: React.FC = () => {
 // States
 const [uploadedImage, setUploadedImage] = useState<File | null>(null);
 const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
 const [prompt, setPrompt] = useState('');

 // Use vision analysis hook
 const {
 analysis,
 loading,
 error,
 analyzeImage,
 reset
 } = useVisionAnalysis();

 // Handle image upload
 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const files = e.target.files;

 if (files && files.length > 0) {
 const file = files[0];
 setUploadedImage(file);

 // Create preview URL
 const reader = new FileReader();
 reader.onloadend = () => {
 setImagePreviewUrl(reader.result as string);
 };
 reader.readAsDataURL(file);
 }
 };

 // Handle form submission
 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();

 if (!uploadedImage) {
 return;
 }

 analyzeImage(
 uploadedImage,
 prompt || undefined
 );
 };

 return (
 <div className="max-w-3xl mx-auto">
 <h2 className="text-2xl font-bold mb-6">AI Image Analysis</h2>

 <form onSubmit={handleSubmit}>
 <div className="mb-4">
 <label className="block text-sm font-medium mb-1">
 Upload Image
 </label>
 <input
 type="file"
 accept="image/jpeg,image/png,image/gif"
 onChange={handleImageChange}
 className="w-full p-2 border rounded-lg"
 />
 </div>

 {imagePreviewUrl && (
 <div className="mb-4">
 <div className="border rounded-lg overflow-hidden max-h-64">
 <img
 src={imagePreviewUrl}
 alt="Preview"
 className="max-w-full h-auto"
 />
 </div>
 </div>
 )}

 <div className="mb-4">
 <label className="block text-sm font-medium mb-1">
 Analysis Instructions (Optional)
 </label>
 <input
 type="text"
 value={prompt}
 onChange={(e) => setPrompt(e.target.value)}
 placeholder="E.g., 'Describe what's in this image' or 'Identify objects in this scene'"
 className="w-full border rounded-lg p-2"
 />
 </div>

 <div className="flex space-x-3">
 <button
 type="submit"
 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
 disabled={loading || !uploadedImage}
 >
 {loading ? 'Analyzing...' : 'Analyze Image'}
 </button>

 <button
 type="button"
 className="px-4 py-2 border border-gray-300 rounded-lg"
 onClick={() => {
 reset();
 setUploadedImage(null);
 setImagePreviewUrl(null);
 setPrompt('');
 }}
 disabled={loading}
 >
 Reset
 </button>
 </div>
 </form>

 {error && (
 <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
 Error: {error}
 </div>
 )}

 {analysis && (
 <div className="mt-6">
 <h3 className="text-lg font-medium mb-2">Image Analysis</h3>
 <div className="p-4 bg-gray-50 border rounded-lg whitespace-pre-wrap">
 {analysis}
 </div>
 </div>
 )}
 </div>
 );
};

export default VisionAnalysisForm;
```

## Secure Integration Checklist Before deploying OpenAI integration, ensure: - [ ] API keys are stored securely on the server sid e - [ ] Server-side validation of all user input s - [ ] Rate limiting is applied to AI endpoint

s

- [ ] Error handling is implemented for API failures
- [ ] Usage monitoring is in place
- [ ] User data privacy is maintained
- [ ] Response content is validated and sanitized
- [ ] Performance optimizations (e.g., caching when appropriate)
- [ ] Proper logging for security monitoring
- [ ] Clear user communication about AI usage

## See Also - [OpenAI Integration Guide for Security Scanning](SECURITY-OPENAI-INTEGRATION-GUIDE-balanced.md) - 33% matc h - [OpenAI Integration Guide for Security Scannin](SECURITY-OPENAI-INTEGRATION-GUIDE-optimized.md) - 33% matc

h

- [OpenAI Integration Guide for Security Scanning](SECURITY-OPENAI-INTEGRATION-GUIDE.md) - 33% match
- [AI Security Integration Documentation](AI-SECURITY-INTEGRATION.md) - 25% match
- [API Security Integration Guid](API_SECURITY_INTEGRATION_TEMPLATE.md) - 25% match