# Embedded Content Integration Gu

i

d e how to safely integrate embedded content (iframes, embeds, third-party widgets) while maintaining security.

## Secure Embedding Checklist Before embedding any external content: - [ ] Verify domain is in the trusted domain allowlis t - [ ] Use proper sandbox attributes for iframe conten t - [ ] Set appropriate Content Security Policy - [ ] Provide fallback content for when embedding fail

s

- [ ] Add proper loading attributes for performance

## Implementation Pattern Always use the `useSecurityContext` hook to access security configurations when embedding external conten

t:

```jsx

import { useSecurityContext } from '@/hooks/useSecurityContext';

function SecureEmbed({ src, title, width = '100%', height = '400px' }) {
 const { isAllowedDomain, securityConfig } = useSecurityContext();
 const { fallbackBehavior } = securityConfig.embeddedContent;

 // Extract domain from src
 let domain = '';
 try {
 domain = new URL(src).hostname;
 } catch (e) {
 console.error('Invalid URL:', src);
 return <FallbackContent reason="invalid-url" />;
 }

 // Check if domain is allowed
 if (!isAllowedDomain(domain)) {
 return <FallbackContent reason="untrusted-domain" domain={domain} />;
 }

 return (
 <iframe
 src={src}
 title={title}
 width={width}
 height={height}
 sandbox={securityConfig.embeddedContent.defaultSandboxPolicy}
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 allow="fullscreen"
 onError={() => <FallbackContent reason="load-error" />}
 />
 );
}

function FallbackContent({ reason, domain }) {
 switch(reason) {
 case 'untrusted-domain':
 return (
 <div className="fallback-content">
 <p>Content from {domain} cannot be embedded due to security restrictions.</p>
 </div>
 );
 case 'invalid-url':
 return (
 <div className="fallback-content">
 <p>Cannot embed content: invalid URL provided.</p>
 </div>
 );
 case 'load-error':
 return (
 <div className="fallback-content">
 <p>Content failed to load. Please try again later.</p>
 </div>
 );
 default:
 return (
 <div className="fallback-content">
 <p>Content cannot be displayed.</p>
 </div>
 );
 }
}
```

## Implementing Content Security Policy Content Security Policy (CSP) should be defined at the application level, but can be extended for specific embedded conten

t:

```jsx

// For components that need special CSP directives

function ExtendedCSPEmbed({ src, title, width = '100%', height = '400px', additionalDirectives = [] }) {
 const { isAllowedDomain, securityConfig } = useSecurityContext();

 // Extract domain from src
 let domain = '';
 try {
 domain = new URL(src).hostname;
 } catch (e) {
 console.error('Invalid URL:', src);
 return <FallbackContent reason="invalid-url" />;
 }

 // Check if domain is allowed
 if (!isAllowedDomain(domain)) {
 return <FallbackContent reason="untrusted-domain" domain={domain} />;
 }

 // Combine the default feature policy with additional directives
 const featurePolicy = [
 ...securityConfig.embeddedContent.defaultFeaturePolicy,
 ...additionalDirectives
 ].join('; ');

 return (
 <iframe
 src={src}
 title={title}
 width={width}
 height={height}
 sandbox={securityConfig.embeddedContent.defaultSandboxPolicy}
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 allow={featurePolicy}
 onError={() => <FallbackContent reason="load-error" />}
 />
 );
}
```

## Special Cases and Exceptions Some embedded content may require special handling: ### YouTube Embeds YouTube embeds should use the privacy-enhanced mod

e:

```jsx

function YouTubeEmbed({ videoId, title, width = '100%', height = '400px' }) {
 const { securityConfig } = useSecurityContext();

 // Use YouTube's privacy-enhanced domain
 const src = `https://www.youtube-nocookie.com/embed/${videoId}`;

 return (
 <iframe
 src={src}
 title={title || `YouTube video ${videoId}`}
 width={width}
 height={height}
 sandbox={securityConfig.embeddedContent.defaultSandboxPolicy}
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowFullScreen
 onError={() => <FallbackContent reason="load-error" />}
 />
 );
}
``` ### Google Maps Embeds Google Maps embeds need specific permission

s:

```jsx

function GoogleMapEmbed({ location, title, width = '100%', height = '400px' }) {
 const { securityConfig } = useSecurityContext();

 const src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(location)}`;

 return (
 <iframe
 src={src}
 title={title || `Map of ${location}`}
 width={width}
 height={height}
 sandbox={`${securityConfig.embeddedContent.defaultSandboxPolicy} allow-same-origin`}
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 allow="geolocation"
 onError={() => <FallbackContent reason="load-error" />}
 />
 );
}
```

## Complete Integration Example Here's an example of a complete implementation of secure embedded conten

t:

```jsx

import React from 'react';

import { useSecurityContext } from '@/hooks/useSecurityContext';

export const ExternalEmbedProvider = ({ children, src, type, title, width, height, additionalAllowedFeatures = [] }) => {
 const { isAllowedDomain, securityConfig, securityLogger } = useSecurityContext();

 // Extract domain from src
 let domain = '';
 try {
 domain = new URL(src).hostname;
 } catch (e) {
 securityLogger.logSecurityEvent({
 type: 'invalid_embed_url',
 details: { src, error: e.message },
 severity: 'medium'
 });
 return <FallbackContent reason="invalid-url" />;
 }

 // Check if domain is allowed
 if (!isAllowedDomain(domain)) {
 securityLogger.logSecurityEvent({
 type: 'blocked_embed_domain',
 details: { domain, src },
 severity: 'medium'
 });
 return <FallbackContent reason="untrusted-domain" domain={domain} />;
 }

 // Log the successful embed
 securityLogger.logSecurityEvent({
 type: 'external_content_embedded',
 details: { domain, src, type },
 severity: 'info'
 });

 // Specialized handling based on embed type
 switch (type) {
 case 'youtube':
 return <YouTubeEmbed videoId={src.split('/').pop()} title={title} width={width} height={height} />;
 case 'googlemap':
 return <GoogleMapEmbed location={src} title={title} width={width} height={height} />;
 default:
 // Standard iframe embed
 return (
 <iframe
 src={src}
 title={title || `Embedded content from ${domain}`}
 width={width || '100%'}
 height={height || '400px'}
 sandbox={securityConfig.embeddedContent.defaultSandboxPolicy}
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 allow={[...securityConfig.embeddedContent.defaultFeaturePolicy, ...additionalAllowedFeatures].join('; ')}
 onError={() => <FallbackContent reason="load-error" />}
 />
 );
 }
};

function FallbackContent({ reason, domain }) {
 // Implementation as shown earlier
}

function YouTubeEmbed({ videoId, title, width, height }) {
 // Implementation as shown earlier
}

function GoogleMapEmbed({ location, title, width, height }) {
 // Implementation as shown earlier
}

export default ExternalEmbedProvider;
```

## Best Practices 1. **Always validate domains** against the security context allowlis t 2. **Provide meaningful fallback content** with clear error messaging 3. **Use the most restrictive sandbox attributes** needed for functionality 4. **Log all embedding operations** for security auditing 5. **Set appropriate loading attributes** for performance optimization 6. **Use specialized components** for common embed types (YouTube, Maps, etc.) 7. **Never bypass security checks** based on user roles or other condition

s

## See Also - [Agent Security Integration Guid](AGENT_SECURITY_INTEGRATION_GUIDE.md) - 33% matc h - [Comprehensive Security System Guide for Replit Agen](AGENT_SECURITY_SYSTEM_MASTER_GUIDE.md) - 25% matc

h

- [Content Security Policy (CSP) Configuration Guide how Content Security Policy is configured in the Dale Loves Whales application to balance security with functionality. ## Overview The application uses Content Security Policy (CSP) in two places: 1. **Express/Node.js Server**: Uses Helmet middleware to add CSP headers](CONTENT_SECURITY_POLICY-enhanced.md) - 25% matc

h
- [Content Security Policy (CSP) Configuration Guide](CONTENT_SECURITY_POLICY.md) - 25% match
- [Embedding External Content Guide](EMBEDDING-CONTENT-GUIDE.md) - 25% match