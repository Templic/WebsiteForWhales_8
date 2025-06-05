/**
 * Enhanced Service Worker for Cross-Browser Compatibility
 * Optimized for Chrome, Firefox, Safari, Edge, Opera on mobile and desktop
 */

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `cosmic-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `cosmic-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `cosmic-images-${CACHE_VERSION}`;

// Cache strategies based on browser capabilities
const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first',
  images: 'cache-first',
  fonts: 'cache-first'
};

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/styles/browser-compatibility.css',
  '/manifest.json'
];

// Browser-specific optimizations
const BROWSER_OPTIMIZATIONS = {
  safari: {
    maxCacheSize: 50, // MB - Safari has stricter limits
    imageFormats: ['webp', 'jpg'],
    preloadStrategy: 'conservative'
  },
  firefox: {
    maxCacheSize: 100,
    imageFormats: ['webp', 'jpg'],
    preloadStrategy: 'moderate'
  },
  chrome: {
    maxCacheSize: 200,
    imageFormats: ['avif', 'webp', 'jpg'],
    preloadStrategy: 'aggressive'
  },
  edge: {
    maxCacheSize: 150,
    imageFormats: ['webp', 'jpg'],
    preloadStrategy: 'moderate'
  }
};

// Detect browser from user agent
function detectBrowser() {
  const ua = self.navigator.userAgent;
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Edge')) return 'edge';
  return 'chrome'; // Default fallback
}

// Get browser-specific configuration
function getBrowserConfig() {
  const browser = detectBrowser();
  return BROWSER_OPTIMIZATIONS[browser] || BROWSER_OPTIMIZATIONS.chrome;
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(IMAGE_CACHE),
      caches.open(DYNAMIC_CACHE)
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests with browser-specific optimizations
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isFontRequest(url)) {
    event.respondWith(handleFontRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Check if request is for static asset
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.html', '.json'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Check if request is for image
function isImageRequest(url) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
  return imageExtensions.some(ext => url.pathname.endsWith(ext));
}

// Check if request is for API
function isAPIRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Check if request is for font
function isFontRequest(url) {
  const fontExtensions = ['.woff', '.woff2', '.ttf', '.otf'];
  return fontExtensions.some(ext => url.pathname.endsWith(ext));
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignore background update failures
      });
      
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Static asset fetch failed:', error);
    
    // Fallback for HTML requests
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE);
      return cache.match('/index.html');
    }
    
    throw error;
  }
}

// Handle images with browser-specific optimization
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Browser-specific image caching
      const browserConfig = getBrowserConfig();
      const shouldCache = await shouldCacheImage(request, networkResponse, browserConfig);
      
      if (shouldCache) {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Image fetch failed:', error);
    
    // Return fallback image or placeholder
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#999">Image unavailable</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful GET requests
      if (request.method === 'GET') {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] API fetch failed:', error);
    
    // Try to serve from cache for GET requests
    if (request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Network unavailable', offline: true }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle font requests with cache-first strategy
async function handleFontRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Font fetch failed:', error);
    throw error;
  }
}

// Handle dynamic requests
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      
      // Don't cache if response is too large
      const contentLength = networkResponse.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 1024 * 1024) { // 1MB limit
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Dynamic request failed:', error);
    
    // Try to serve from cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Determine if image should be cached based on browser capabilities
async function shouldCacheImage(request, response, browserConfig) {
  const contentLength = response.headers.get('content-length');
  const imageSize = contentLength ? parseInt(contentLength) : 0;
  
  // Don't cache very large images
  const maxImageSize = browserConfig.maxCacheSize * 1024 * 1024 * 0.1; // 10% of max cache
  if (imageSize > maxImageSize) {
    return false;
  }
  
  // Check current cache usage
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      const usagePercentage = estimate.usage / estimate.quota;
      
      // Don't cache if storage is almost full
      if (usagePercentage > 0.8) {
        return false;
      }
    } catch (error) {
      // Ignore storage estimation errors
    }
  }
  
  return true;
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('[SW] Performing background sync');
  
  // Retry failed requests stored in IndexedDB
  // This would integrate with your app's offline queue
  try {
    // Implementation would depend on your app's specific needs
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle action clicks
    console.log('[SW] Notification action clicked:', event.action);
  } else {
    // Handle notification click
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

// Message handling for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Force update cache
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  console.log('[SW] Updating cache');
  
  const cache = await caches.open(STATIC_CACHE);
  
  try {
    await cache.addAll(STATIC_ASSETS);
    console.log('[SW] Cache updated successfully');
  } catch (error) {
    console.error('[SW] Cache update failed:', error);
  }
}

console.log('[SW] Service worker loaded successfully');