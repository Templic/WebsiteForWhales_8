# Embedding External Content Guid

e

This guide provides instructions for safely embedding external content like YouTube videos and Google Maps in your application using our secure proxy components.

## Why Use Secure Proxy Components? Traditional approaches to embedding third-party content like YouTube videos or Google Maps can lead to security issues: - Cross-Origin Resource Sharing (CORS) restriction

s

- Content Security Policy (CSP) violations
- Cross-Site Request Forgery (CSRF) token verification failures
- Inconsistent behavior across browsers and devices Our secure proxy components address these issues by: 1. Serving external content through our own domain

2. Bypassing security restrictions safely and selectively

3. Providing simple React components with a clean API

## Available Components ### 1. YouTube Videos Use the `ProxyYouTubeEmbed` component to embed YouTube video

s:

```jsx

import { ProxyYouTubeEmbed } from '../components/security/ProxyYouTubeEmbed';

<ProxyYouTubeEmbed
 videoId="jzpvkq3Krjg"
 title="Video Title"
 width="100%"
 height={450}
 className="rounded-lg shadow-md"
/>
``` #### Props | Prop | Type | Default | Descriptio

n |

|------|------|---------|-------------|
| `videoId` | string | (required) | YouTube video ID (the 11-character code from YouTube URL) |

| `title` | string | "YouTube Video" | Accessible title for the iframe |
| `width` | string \| number | "100%" | Width of the embed |

| `height` | number | 315 | Height of the embed in pixels |
| `className` | string | "" | CSS class names to apply to the iframe |

### 2. Google Maps Use the `ProxyGoogleMapEmbed` component to embed Google Map

s:

```jsx

import { ProxyGoogleMapEmbed } from '../components/security/ProxyGoogleMapEmbed';

<ProxyGoogleMapEmbed
 query="Rainbow Falls, Hilo, Hawaii"
 zoom={6}
 title="Hawaiian Islands Map"
 width="100%"
 height={450}
 className="rounded-lg shadow-md"
/>
``` #### Props | Prop | Type | Default | Descriptio

n |

|------|------|---------|-------------|
| `query` | string | (required) | Location or search query for Google Maps |

| `zoom` | number | 10 | Zoom level (1-20, where higher numbers zoom in closer) |
| `title` | string | "Google Map" | Accessible title for the iframe |

| `width` | string \| number | "100%" | Width of the embed |
| `height` | number | 450 | Height of the embed in pixels |

| `className` | string | "" | CSS class names to apply to the iframe |

## Usage Examples ### Embedding a YouTube Video on a Pag

e

```jsx

import React from 'react';

import { ProxyYouTubeEmbed } from '../components/security/ProxyYouTubeEmbed';

export default function EventPage() {
 return (
 <div className="event-page">
 <h1>Annual Concert Highlights</h1>

 <div className="video-container my-6 bg-gray-900 p-4 rounded-xl">
 <h2 className="text-xl text-cyan-300 mb-3">Performance Highlights</h2>
 <ProxyYouTubeEmbed
 videoId="jzpvkq3Krjg"
 title="Concert Highlights Video"
 height={480}
 className="rounded-lg"
 />
 <p className="text-sm text-gray-400 mt-2">
 Recorded live at our annual concert event
 </p>
 </div>
 </div>
 );
}
``` ### Embedding a Google Map with Location Marker

s

```jsx

import React from 'react';

import { ProxyGoogleMapEmbed } from '../components/security/ProxyGoogleMapEmbed';

export default function LocationsPage() {
 return (
 <div className="locations-page">
 <h1>Our Locations</h1>

 <div className="map-container my-6 bg-gray-900 p-4 rounded-xl">
 <h2 className="text-xl text-cyan-300 mb-3">Hawaiian Islands Tour Locations</h2>
 <ProxyGoogleMapEmbed
 query="Hawaiian Islands"
 zoom={7}
 title="Hawaiian Islands Tour Locations"
 height={500}
 className="rounded-lg"
 />
 <p className="text-sm text-gray-400 mt-2">
 View all our performance locations across the Hawaiian Islands
 </p>
 </div>
 </div>
 );
}
```

## Best Practices ### YouTube Videos 1. **Video IDs**: Extract only the 11-character video ID from YouTube URLs. For example: - From `https://www.youtube.com/watch?v=jzpvkq3Krjg` → use `jzpvkq3Krjg` - From `https://youtu.be/jzpvkq3Krjg` → use `jzpvkq3Krjg` 2. **Accessibility**: Always provide descriptive titles for videos 3. **Responsive Design**: Use percentage widths and appropriate heights for responsive layouts ### Google Maps 1. **Query Formatting**: Use clear, specific location queries for accurate map rendering - Good examples: "Rainbow Falls, Hilo, Hawaii", "Waikiki Beach, Honolulu" - Poor examples: "Hawaii", "beach" (too vague) 2. **Zoom Levels**: Choose appropriate zoom levels: - 1-5: World, continent, or country view - 6-10: Region, state, or large city view - 11-15: Neighborhood or district view - 16-20: Street or building view 3. **Performance**: Maps can be resource-intensive; lazy-load them when they're not in the initial viewpor

t

## Technical Details Under the hood, these components use our server-side proxy approach: 1. Instead of embedding third-party content directly, requests go to our serve

r

2. Our server fetches and serves the content from our own domain

3. Our middleware handles all necessary security exemptions This approach eliminates cross-origin issues and security blockages that commonly occur with embedded content.

## Troubleshooting ### Common Issues | Issue | Potential Solution

s |

|-------|---------------------|

| Video doesn't load | Check that the video ID is correct and exactly 11 characters |
| Map shows incorrect location | Try a more specific query with city/state/country |

| Content appears too small | Adjust height/width properties appropriately for your layout |
| Security console errors | Contact the development team; this may indicate a configuration issue |

## Migration Guide If you're currently using direct embeds or other embedding approaches, follow these steps to migrate: ### From Direct YouTube Embeds **Befor

e:**

```html
<iframe
 src="https://www.youtube.com/embed/jzpvkq3Krjg"
 width="560"
 height="315"
 frameborder="0"
 allowfullscreen
></iframe>
``` **After:**
```jsx
<ProxyYouTubeEmbed
 videoId="jzpvkq3Krjg"
 width="100%"
 height={315}
/>
``` ### From Direct Google Maps Embeds **Befor

e:**
```html
<iframe
 src="https://www.google.com/maps/embed?pb=!1m18!1m12!..."
 width="600"
 height="450"
 frameborder="0"
 allowfullscreen
></iframe>
``` **After:**
```jsx
<ProxyGoogleMapEmbed
 query="Rainbow Falls, Hilo, Hawaii"
 zoom={6}
 width="100%"
 height={450}
/>
```

## Conclusion By using these secure proxy components, you can safely embed external content in your application without worrying about security issues or cross-origin restrictions. The components provide a simple, consistent API while handling all the complex security considerations behind the scene

s.

## See Also - [Embedded Content Security Changelog](EMBEDDED-CONTENT-CHANGELOG.md) - 33% matc

h

- [Embedded Content Security Guide (Updated May 2025)](security-guides/5-embedded-content-guide.md) - 31% match
- [Secure Embedded Content Solution](SECURE-EMBEDS-SOLUTION.md) - 25% match
- [Security Configuration for Embedded Content](SECURITY-CONFIGURATION-EMBEDDED-CONTENT.md) - 25% match
- [AI Security Guide](security-guides/4-ai-security-guide.md) - 24% match