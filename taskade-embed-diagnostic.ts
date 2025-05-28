/**
 * Taskade Embed Diagnostic Tool
 * Analyzes security blocks and embed issues
 */

export async function runTaskadeEmbedDiagnostic() {
  const diagnostic = {
    timestamp: new Date().toISOString(),
    checks: [],
    issues: [],
    recommendations: []
  };

  // Check 1: Server Route Accessibility
  try {
    const response = await fetch('/taskade-embed?id=01JRV02MYWJW6VJS9XGR1VB5J4');
    diagnostic.checks.push({
      name: 'Server Route Access',
      status: response.ok ? 'PASS' : 'FAIL',
      details: `Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`
    });
    
    if (!response.ok) {
      diagnostic.issues.push(`Taskade embed route returns ${response.status}`);
    }
  } catch (error) {
    diagnostic.checks.push({
      name: 'Server Route Access',
      status: 'ERROR',
      details: error.message
    });
    diagnostic.issues.push('Cannot access Taskade embed route');
  }

  // Check 2: CSP Headers
  try {
    const response = await fetch('/');
    const csp = response.headers.get('content-security-policy');
    const hasTaskadeDomain = csp && csp.includes('taskade.com');
    
    diagnostic.checks.push({
      name: 'CSP Configuration',
      status: hasTaskadeDomain ? 'PASS' : 'FAIL',
      details: hasTaskadeDomain ? 'Taskade domains allowed' : 'Taskade domains not found in CSP'
    });
    
    if (!hasTaskadeDomain) {
      diagnostic.issues.push('Content Security Policy may be blocking Taskade embeds');
    }
  } catch (error) {
    diagnostic.checks.push({
      name: 'CSP Configuration', 
      status: 'ERROR',
      details: error.message
    });
  }

  // Check 3: API Integration Status
  try {
    const response = await fetch('/api/taskade/integration');
    if (response.ok) {
      const data = await response.json();
      diagnostic.checks.push({
        name: 'Taskade API Integration',
        status: data.enabled ? 'PASS' : 'WARN',
        details: `API Key: ${data.api_key}, Embed Ready: ${data.embed_ready}`
      });
      
      if (!data.enabled) {
        diagnostic.issues.push('Taskade API key not configured');
        diagnostic.recommendations.push('Set TASKADE_API_KEY environment variable');
      }
    }
  } catch (error) {
    diagnostic.checks.push({
      name: 'Taskade API Integration',
      status: 'ERROR', 
      details: error.message
    });
  }

  // Check 4: X-Frame-Options
  try {
    const response = await fetch('/taskade-embed?id=01JRV02MYWJW6VJS9XGR1VB5J4');
    const xFrameOptions = response.headers.get('x-frame-options');
    
    diagnostic.checks.push({
      name: 'X-Frame-Options',
      status: !xFrameOptions || xFrameOptions.toLowerCase() === 'sameorigin' ? 'PASS' : 'FAIL',
      details: xFrameOptions ? `Set to: ${xFrameOptions}` : 'Not set (good for embeds)'
    });
    
    if (xFrameOptions && xFrameOptions.toLowerCase() === 'deny') {
      diagnostic.issues.push('X-Frame-Options: DENY prevents iframe embedding');
    }
  } catch (error) {
    diagnostic.checks.push({
      name: 'X-Frame-Options',
      status: 'ERROR',
      details: error.message  
    });
  }

  // Generate recommendations
  if (diagnostic.issues.length > 0) {
    diagnostic.recommendations.push('Review and fix identified security blocks');
    diagnostic.recommendations.push('Test embed page directly in browser');
    diagnostic.recommendations.push('Check browser console for detailed error messages');
  } else {
    diagnostic.recommendations.push('All checks passed - embed should work');
  }

  return diagnostic;
}

// Console diagnostic runner
if (typeof window !== 'undefined') {
  (window as any).runTaskadeDiagnostic = async () => {
    const result = await runTaskadeEmbedDiagnostic();
    console.group('🐋 Taskade Embed Diagnostic Report');
    console.log('Timestamp:', result.timestamp);
    console.log('Issues Found:', result.issues.length);
    
    result.checks.forEach(check => {
      const emoji = check.status === 'PASS' ? '✅' : check.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`${emoji} ${check.name}: ${check.status} - ${check.details}`);
    });
    
    if (result.issues.length > 0) {
      console.group('🚨 Issues Detected:');
      result.issues.forEach(issue => console.log('•', issue));
      console.groupEnd();
    }
    
    if (result.recommendations.length > 0) {
      console.group('💡 Recommendations:');
      result.recommendations.forEach(rec => console.log('•', rec));
      console.groupEnd();
    }
    
    console.groupEnd();
    return result;
  };
}