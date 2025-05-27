# Taskade Embedding Implementation Guid

e

## Purpose This guide provides implementation details and best practices for embedding Taskade AI agents within the Dale Loves Whales application. It covers the client-side components, server-side implementation, and security consideration

s.

## Purpose This guide provides implementation details and best practices for embedding Taskade AI agents within the Dale Loves Whales application. It covers the client-side components, server-side implementation, and security consideration

s.

## Client-Side Implementation ### Component Selection Guide Choose the appropriate component based on your integration needs: | Component | Use Case | Descriptio

n |

|-----------|----------|-------------|

| `TaskadeEmbed` | In-page embedding | For embedding Taskade directly within page content |
| `TaskadeWidget` | Floating assistant | For providing a floating chat button that expands into a chat window |

### Style Selection Guide Choose the appropriate style based on your page context: | Style | Best For | Visual Characteristic

s |

|-------|----------|------------------------|

| `basic` | Minimal interfaces | Clean, simple styling using application's theme colors |
| `taskade` | Standalone AI features | Taskade's native UI with dark backgrounds and purple/indigo accents |

| `oceanic` | Ocean-themed pages | Blue/cyan gradients with slate backgrounds |

### Implementation Examples #### Basic Embed Exampl

e

```jsx

import TaskadeEmbed from '@/components/chat/TaskadeEmbed';

<TaskadeEmbed
 taskadeId="YOUR_TASKADE_ID"
 title="Cosmic Consciousness Guide"
 style="basic"
 view="agent"
 height={500}
 width="100%"
/>
``` #### Widget with Custom Greetin

g

```jsx

import TaskadeWidget from '@/components/chat/TaskadeWidget';

<TaskadeWidget
 taskadeId="YOUR_TASKADE_ID"
 title="Meditation Assistant"
 style="oceanic"
 position="bottom-right"
 greetingMessage="Need guidance with your meditation practice?"
/>
``` #### Full-Page Integratio

n

```jsx

import TaskadeEmbed from '@/components/chat/TaskadeEmbed';

<div className="h-screen">
 <TaskadeEmbed
 taskadeId="YOUR_TASKADE_ID"
 title="Cosmic Intelligence"
 style="taskade"
 view="agent"
 showToolbar={false}
 height="100%"
 width="100%"
 />
</div>
```

## Server-Side Implementation ### Embed Page Configuration The custom `/taskade-embed` page is responsible for securely embedding Taskade while maintaining our application's styling and security requirements. Key feature

s:

- Parameter validation
- CSS variable injection for theming
- CSP header configuration
- CSRF protection exemption ### Middleware Configuration The content API CSRF bypass middleware has been configured to support Taskade domain

s:

```javascript
// Taskade domains that should be exempt from CSRF protection

const TASKADE_DOMAINS = [
 'taskade.com',
 'www.taskade.com',
 'ai.taskade.com',
 // Add any additional Taskade domains here
];
```

## Page-Specific Recommendations Based on the application's structure, here are recommended implementations for specific pages: | Page | Recommended Component | Style | Note

s |

|------|----------------------|-------|-------|

| Home | TaskadeWidget | oceanic | Bottom-right position for accessibility |
| Cosmic Consciousness | TaskadeEmbed | taskade | Embedded in content area |

| Meditation | TaskadeEmbed | basic | Simple integration with meditation content |
| Music | TaskadeWidget | oceanic | Provides assistance without disrupting listening |

| Tour | TaskadeWidget | basic | Minimal interference with tour content |

## Taskade Agents The following Taskade agents are available for integration: | Agent ID | Name | Purpose | Recommended Styl

e |

|----------|------|---------|-------------------|

| 01JRV02MYWJW6VJS9XGR1VB5J4 | Cosmic Assistant | General cosmic consciousness guidance | taskade |
| AGENT_ID_2 | Meditation Guide | Meditation instruction and guidance | basic |

| AGENT_ID_3 | Ocean Expert | Marine biology and oceanography information | oceanic |
| AGENT_ID_4 | Music Guide | Assistance with frequency harmonization | oceanic |

## Performance Considerations To maintain optimal performance when using Taskade embeds: 1. **Lazy Loading**: Only load the component when needed, especially for TaskadeWidge

t

2. **Memory Management**: Set `enableMemory={false}` for ephemeral interactions

3. **View Selection**: Use `view="chat"` for simpler interactions to reduce load time

4. **Style Impact**: The `basic` style has the smallest performance footprint

## Testing When implementing Taskade components, test the following scenarios: 1. **Responsiveness**: Verify behavior across various screen size

s

2. **Theme Switching**: Test both light and dark mode compatibility

3. **Style Switching**: Verify all three styles render correctly

4. **Error States**: Test behavior when Taskade service is unavailable

5. **Memory Persistence**: Verify conversation continuity when `enableMemory` is enabled

## Troubleshooting Common issues and solutions: | Issue | Possible Cause | Solutio

n |

|-------|---------------|----------|

| Component not rendering | Missing ID | Verify taskadeId is valid |
| Incorrect styling | Style conflict | Check for CSS conflicts with the selected style |

| Widget not appearing | Position issue | Try alternative positions or check z-index |
| CSRF errors | Missing exemption | Verify contentApiCsrfBypass middleware configuration |

## Further Reading - [Taskade Integration Overview](./TASKADE-INTEGRATION.m

d)

- [Taskade Technical Details](./TASKADE-TECHNICAL.md)
- [Example Implementation](../examples/TaskadeStylesExample.tsx)

## See Also - [Taskade Integration Documentation](TASKADE-INTEGRATION.md) - 25% matc

h

- [Taskade Styling Guide](TASKADE-STYLING-GUIDE.md) - 25% match
- [Taskade Integration Technical Documentation](TASKADE-TECHNICAL.md) - 18% match
- [Security Guides Index (Updated May 2025)](security-guides/SECURITY-GUIDES-INDEX.md) - 17% match