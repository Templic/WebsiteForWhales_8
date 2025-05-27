# OpenAI Integration Guide for Security Scannin

g

This document provides details on how our security scanning system integrates with OpenAI to provide AI-powered security analysis and recommendations.

## Overview Our security scanning system leverages OpenAI's powerful GPT-4o model to analyze security scan results, identify patterns, prioritize issues, and provide actionable recommendations. This integration enhances the security scanning capabilities beyond simple rule-based check

s.

## Integration Architecture The OpenAI integration consists of several components: 1. **AI Analysis Service** - Sends security scan data to OpenAI and processes response

s

2. **Security Scanner Integration** - Security scanners that use AI for deeper analysis

3. **Security Dashboard** - UI for displaying AI-generated recommendations

4. **Configuration** - Environment variables and settings for the integration

## Setting Up OpenAI Integration ### Prerequisites 1. An OpenAI API key (with access to the GPT-4o mode

l)

2. Proper environment configuration (see below)

3. Network connectivity to OpenAI's API endpoints ### Environment Configuration Add your OpenAI API key to the `.env` or `.env.local` fil

e:

```

OPENAI_API_KEY=your_api_key_here

SECURITY_ALLOW_OPENAI_IN_CSP=true

SECURITY_BYPASS_CSRF_FOR_OPENAI=true
``` ### Security Requirements Ensure your Content Security Policy (CSP) allows connections to OpenA

I:

```typescript
// In server/index.ts or similar configuration file

app.use(
 helmet({
 contentSecurityPolicy: {
 directives: {
 connectSrc: ["'self'", "https://*.openai.com"],
 // Other directives...
 }
 }
 })
);
```

## How the Integration Works ### 1. Security Scan Process When a security scan is performed: 1. The Core Security Scanner collects raw scan dat

a

2. Specific high-value issues are selected for AI analysis

3. The AI analysis service sends this data to OpenAI

4. The response is parsed and formatted as actionable recommendations

5. These recommendations are stored and displayed in the Security Dashboard ### 2. AI Analysis Implementation The core functionality is implemented in the `performAiSecurityAnalysis` functio

n:

```typescript
/**
 * Performs AI-powered analysis of security scan results
 * @param scanResults The raw scan results to analyze
 * @returns AI-generated recommendations and insights
 */

async function performAiSecurityAnalysis(scanResults: ScanResultSummary): Promise<AIRecommendation[]> {
 try {
 // Check if OpenAI API key is available
 if (!process.env.OPENAI_API_KEY) {
 console.error('OpenAI API key not found. AI security analysis skipped.');
 return [];
 }

 // Create OpenAI client
 const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY
 });

 // Prepare context for the AI
 const prompt = prepareSecurityAnalysisPrompt(scanResults);

 // Call OpenAI API
 const response = await openai.chat.completions.create({
 model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
 messages: [
 {
 role: "system",
 content: "You are a security expert analyzing web application vulnerabilities. Provide clear, actionable recommendations prioritized by severity."
 },
 {
 role: "user",
 content: prompt
 }
 ],
 response_format: { type: "json_object" },
 temperature: 0.3
 });

 // Parse and format the response
 const parsedResponse = JSON.parse(response.choices[0].message.content);

 // Format recommendations
 return formatAIRecommendations(parsedResponse);
 } catch (error) {
 console.error('Error in AI security analysis:', error);
 return [];
 }
}
``` ### 3. Prompt Engineering The prompt sent to OpenAI is carefully crafted to elicit useful security recommendation

s:

```typescript

function prepareSecurityAnalysisPrompt(scanResults: ScanResultSummary): string {
 return `
 Analyze the following security scan results and provide actionable recommendations.
 Focus on the most critical issues first and provide specific remediation steps.

 SCAN RESULTS:
 ${JSON.stringify(scanResults, null, 2)}

 Please format your response as a JSON object with the following structure:
 {
 "recommendations": [
 {
 "id": "unique-id",
 "title": "Brief title of the recommendation",
 "description": "Detailed explanation of the issue",
 "severity": "critical|high|medium|low",
 "remediation": "Step-by-step instructions to fix the issue",
 "relatedFindings": ["finding-id-1", "finding-id-2"],
 "confidence": 0.95, // 0.0 to 1.0
 "category": "authentication|authorization|injection|xss|csrf|etc"
 }
 ],
 "summary": "Brief overall assessment of the application security posture"
 }
 `;
}
```

## Displaying AI Recommendations The Security Dashboard displays AI recommendations in two main ways: 1. **Summary View** - Top 3 most critical recommendations shown prominentl

y

2. **Detailed View** - All recommendations available in the Vulnerabilities tab

## Troubleshooting ### Common Issues 1. **OpenAI API Key Issues** - **Symptom**: "OpenAI API key not found" error in logs - **Solution**: Check that OPENAI_API_KEY is set in .env or .env.local 2. **CSP Blocking OpenAI API** - **Symptom**: "Failed to fetch" or CORS errors in browser console - **Solution**: Ensure CSP allows connections to https://*.openai.com 3. **CSRF Protection Blocking OpenAI Requests** - **Symptom**: 403 Forbidden responses when trying to perform AI analysis - **Solution**: Set SECURITY_BYPASS_CSRF_FOR_OPENAI=true in .env.local 4. **Rate Limiting or Quota Issues** - **Symptom**: 429 Too Many Requests from OpenAI API - **Solution**: Implement request throttling or increase your OpenAI API quota ### Debugging OpenAI Integration Add more detailed logging to troubleshoot issue

s:

```typescript

// Add to performAiSecurityAnalysis function for debugging

console.log('OpenAI request payload:', {
 model: "gpt-4o",
 messages: [/* message content */],
 temperature: 0.3
});

try {
 const response = await openai.chat.completions.create({/*...*/});
 console.log('OpenAI response received, token usage:', response.usage);
} catch (error) {
 console.error('OpenAI API error details:', {
 message: error.message,
 status: error.status,
 type: error.type
 });
 throw error;
}
```

## Best Practices 1. **Protect the OpenAI API Key** - Never expose it in client-side cod

e

2. **Validate AI Recommendations** - Review recommendations before implementing them

3. **Rate Limit API Calls** - Implement throttling to prevent excessive costs

4. **Monitor Token Usage** - Track API usage to manage costs

5. **Provide Clear Context** - Ensure the prompts give OpenAI enough information to provide useful recommendations

## Further Resources - [OpenAI API Documentation](https://platform.openai.com/docs/introductio

n)

- [Security Troubleshooting Guide](./SECURITY-TROUBLESHOOTING.md)
- [Security Documentation Index](./SECURITY-GUIDES-INDEX.md)

## See Also - [AI Security Integration Documentation](AI-SECURITY-INTEGRATION.md)md) - 24% matc

h

- [Security Implementation Plan](SECURITY-IMPLEMENTATION-PLAN.md)md) - 18% match
- [OpenAI Integration for TypeScript Error Management](typescript-openai-integration.md) - 18% match