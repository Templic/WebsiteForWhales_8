/**
 * Embed Proxy Routes
 * Server-side proxy to bypass X-Frame-Options blocking for external embeds
 */

import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// YouTube embed proxy
router.get('/youtube/:videoId', async (req: Request, res: Response) => {
  const { videoId } = req.params;
  
  // Validate videoId format to prevent XSS
  if (!videoId || !videoId.match(/^[a-zA-Z0-9_-]{11}$/)) {
    return res.status(400).send('Invalid YouTube video ID format');
  }

  try {
    // Create YouTube embed HTML with proper headers
    const embedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>YouTube Video</title>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          iframe { width: 100%; height: 100vh; border: 0; }
        </style>
      </head>
      <body>
        <iframe 
          src="https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </body>
      </html>
    `;

    // Set headers to allow embedding
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.removeHeader('X-Frame-Options');
    res.send(embedHtml);
    
  } catch (error) {
    console.error('YouTube embed error:', error);
    res.status(500).send('Error loading YouTube embed');
  }
});

// Taskade embed proxy
router.get('/taskade/:taskadeId', async (req: Request, res: Response) => {
  const { taskadeId } = req.params;
  
  // Validate taskadeId format
  if (!taskadeId || !taskadeId.match(/^[a-zA-Z0-9_-]+$/)) {
    return res.status(400).send('Invalid Taskade ID format');
  }

  try {
    // Create Taskade embed HTML
    const embedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Taskade</title>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          iframe { width: 100%; height: 100vh; border: 0; }
        </style>
      </head>
      <body>
        <iframe 
          src="https://www.taskade.com/a/${taskadeId}"
          title="Taskade AI"
          frameborder="0"
          allow="clipboard-read; clipboard-write; microphone; camera">
        </iframe>
      </body>
      </html>
    `;

    // Set headers to allow embedding
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.removeHeader('X-Frame-Options');
    res.send(embedHtml);
    
  } catch (error) {
    console.error('Taskade embed error:', error);
    res.status(500).send('Error loading Taskade embed');
  }
});

// Google Maps embed proxy
router.get('/maps/hawaii', async (req: Request, res: Response) => {
  try {
    // Create Google Maps embed HTML for Hawaiian Islands
    const embedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Hawaiian Islands Map</title>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          iframe { width: 100%; height: 100vh; border: 0; }
        </style>
      </head>
      <body>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2663525.3112356835!2d-161.67382492051866!3d21.476153723897597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1682970147321!5m2!1sen!2sus"
          title="Hawaiian Islands"
          frameborder="0"
          style="border:0;"
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </body>
      </html>
    `;

    // Set headers to allow embedding
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.removeHeader('X-Frame-Options');
    res.send(embedHtml);
    
  } catch (error) {
    console.error('Google Maps embed error:', error);
    res.status(500).send('Error loading Google Maps embed');
  }
});

export default router;