/**
 * Agent Dead Link Checker
 * 
 * A straightforward script for the Replit agent to check for dead-end links and buttons.
 * This script crawls the pages of the application, identifies broken links and dead-end buttons,
 * and saves the results to a JSON file.
 * 
 * Usage: node scripts/agent-deadlink-checker.js
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

// For ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration with environment variable support
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:5000',
  outputFile: process.env.OUTPUT_FILE || path.join(process.cwd(), 'agent-deadlinks-report.json'),
  maxDepth: parseInt(process.env.MAX_DEPTH || '2', 10), // Reduce depth to finish faster
  timeout: parseInt(process.env.TIMEOUT || '15000', 10), // 15 seconds total timeout
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '5000', 10), // 5 second timeout per request
  maxPages: parseInt(process.env.MAX_PAGES || '20', 10), // Limit the number of pages to scan
};

// State variables
const visitedUrls = new Set();
const brokenLinks = [];
const deadEndButtons = [];
const pages = new Set();
const internalLinks = new Set();
let pageCount = 0;
let isRunning = true;

console.log(`
================================
AGENT DEAD LINK CHECKER
================================
Base URL: ${config.baseUrl}
Max Depth: ${config.maxDepth}
Output: ${config.outputFile}
================================
`);

/**
 * Get the absolute URL from a relative URL
 */
function getAbsoluteUrl(baseUrl, href) {
  if (!href) return null;
  
  // Skip special links
  if (href.startsWith('javascript:') || 
      href.startsWith('mailto:') || 
      href.startsWith('tel:') || 
      href === '#') {
    return null;
  }
  
  // Handle anchor links
  if (href.startsWith('#')) {
    // Remove the fragment from the base URL if it exists
    const baseWithoutFragment = baseUrl.split('#')[0];
    return baseWithoutFragment + href;
  }
  
  try {
    // Handle relative links
    if (href.startsWith('/')) {
      return new URL(href, baseUrl).toString();
    }
    
    // Handle absolute URLs
    if (href.startsWith('http')) {
      return href;
    }
    
    // Handle relative paths without leading slash
    return new URL(href, baseUrl).toString();
  } catch (error) {
    console.error(`Error resolving URL (${baseUrl}, ${href}): ${error.message}`);
    return null;
  }
}

/**
 * Check a URL to see if it returns a valid response
 */
async function checkUrl(url) {
  console.log(`Checking URL: ${url}`);
  
  try {
    const response = await axios.get(url, { 
      validateStatus: false,
      timeout: config.requestTimeout 
    });
    
    return {
      url,
      status: response.status,
      valid: response.status >= 200 && response.status < 400
    };
  } catch (error) {
    console.error(`Error checking URL ${url}: ${error.message}`);
    return {
      url,
      status: error.response ? error.response.status : 0,
      valid: false,
      error: error.message
    };
  }
}

/**
 * Crawl a page and recursively check for broken links
 */
async function crawlPage(url, parentUrl = null, depth = 0) {
  // Stop crawling if we reached limits or if crawling is stopped
  if (!isRunning || pageCount >= config.maxPages) {
    return;
  }
  
  if (depth > config.maxDepth) {
    console.log(`Max depth reached for ${url}`);
    return;
  }
  
  if (visitedUrls.has(url)) {
    console.log(`Already visited ${url}`);
    return;
  }
  
  // Increment page count
  pageCount++;
  console.log(`\nCrawling ${url} (depth: ${depth}, page ${pageCount}/${config.maxPages})`);
  visitedUrls.add(url);
  pages.add(url);
  
  // Stop if we've reached the maximum number of pages
  if (pageCount >= config.maxPages) {
    console.log(`Reached maximum number of pages (${config.maxPages}). Stopping crawl.`);
    isRunning = false;
  }
  
  try {
    // Check if the URL is valid
    const urlCheck = await checkUrl(url);
    if (!urlCheck.valid) {
      console.error(`Broken link found: ${url} (Status: ${urlCheck.status})`);
      brokenLinks.push({
        url,
        parentUrl,
        status: urlCheck.status,
        message: urlCheck.error || `HTTP Error: ${urlCheck.status}`
      });
      return;
    }
    
    // Fetch and parse the page
    const response = await axios.get(url, { 
      validateStatus: false,
      timeout: config.requestTimeout
    });
    
    if (response.status >= 400) {
      console.error(`HTTP Error ${response.status} on page ${url}`);
      brokenLinks.push({
        url,
        parentUrl,
        status: response.status,
        message: `HTTP Error: ${response.status}`
      });
      return;
    }
    
    // Parse the HTML
    const $ = cheerio.load(response.data);
    
    // Check links
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      if (!href) {
        console.log(`Found dead-end link: "${text}" on ${url}`);
        deadEndButtons.push({
          url,
          element: 'a',
          text: text || '[No Text]',
          location: `${url} (index: ${index})`
        });
        return;
      }
      
      const linkUrl = getAbsoluteUrl(url, href);
      
      if (!linkUrl) {
        console.log(`Invalid link: ${href} on ${url}`);
        return;
      }
      
      // Check if this is an internal link
      if (linkUrl.includes(new URL(config.baseUrl).hostname)) {
        internalLinks.add(linkUrl);
        
        // Queue this URL for crawling if we haven't seen it before
        if (!visitedUrls.has(linkUrl)) {
          setTimeout(() => {
            crawlPage(linkUrl, url, depth + 1);
          }, 500); // Add delay to avoid overwhelming the server
        }
      }
    });
    
    // Check buttons
    $('button, .btn, [role="button"]').each((index, element) => {
      const onClick = $(element).attr('onclick');
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      if (!onClick && !href) {
        console.log(`Found dead-end button: "${text}" on ${url}`);
        deadEndButtons.push({
          url,
          element: 'button',
          text: text || '[No Text]',
          location: `${url} (index: ${index})`
        });
      }
    });
    
  } catch (error) {
    console.error(`Error crawling ${url}: ${error.message}`);
    brokenLinks.push({
      url,
      parentUrl,
      status: 0,
      message: error.message
    });
  }
}

/**
 * A simple version that just checks the homepage without recursive crawling
 */
async function simpleCheck() {
  try {
    console.log(`\nRunning simple check on: ${config.baseUrl}`);
    
    // Fetch and parse the homepage only
    const response = await axios.get(config.baseUrl, { 
      validateStatus: false,
      timeout: config.requestTimeout
    });
    
    if (response.status >= 400) {
      console.error(`HTTP Error ${response.status} on homepage`);
      return { 
        homepage: false,
        error: `HTTP Error: ${response.status}`
      };
    }
    
    console.log(`Homepage loaded successfully (${response.status})`);
    
    // Parse the HTML
    const $ = cheerio.load(response.data);
    
    // Extract all links (with broader selector)
    const links = [];
    $('a, [href]').each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      const tagName = $(element).prop('tagName')?.toLowerCase();
      
      if (href) {
        links.push({
          url: href,
          text: text || '[No Text]',
          empty: !href,
          element: tagName || 'unknown'
        });
      }
    });
    
    // Extract all buttons (with broader selector)
    const buttons = [];
    $('button, input[type="button"], input[type="submit"], .btn, [role="button"], [data-role="button"], [class*="button"], [type="button"]').each((index, element) => {
      const onClick = $(element).attr('onclick');
      const href = $(element).attr('href');
      const text = $(element).text().trim() || $(element).attr('value') || $(element).attr('title');
      const tagName = $(element).prop('tagName')?.toLowerCase();
      
      buttons.push({
        text: text || '[No Text]',
        hasAction: !!(onClick || href),
        element: tagName || 'unknown'
      });
    });
    
    console.log(`Found ${links.length} links and ${buttons.length} buttons on homepage`);
    
    // Count dead-end elements
    const deadEndLinks = links.filter(link => link.empty);
    const deadEndButtons = buttons.filter(button => !button.hasAction);
    
    return {
      homepage: true,
      links: {
        total: links.length,
        deadEnds: deadEndLinks.length,
        items: deadEndLinks,
        allLinks: links // Include all found links
      },
      buttons: {
        total: buttons.length,
        deadEnds: deadEndButtons.length,
        items: deadEndButtons,
        allButtons: buttons // Include all found buttons
      }
    };
  } catch (error) {
    console.error(`Error checking homepage: ${error.message}`);
    return {
      homepage: false,
      error: error.message
    };
  }
}

/**
 * Main function to run the checker
 */
async function main() {
  const startTime = new Date();
  console.log(`Scan started at: ${startTime.toISOString()}`);
  
  try {
    // First do a simple check of the homepage
    const simpleResults = await simpleCheck();
    
    // Then do a more comprehensive crawl if the homepage was accessible
    if (simpleResults.homepage) {
      console.log('\nHomepage is accessible, proceeding with crawl...');
      await crawlPage(config.baseUrl);
      
      // Wait for some crawls to finish but with shorter timeout
      console.log('\nWaiting for crawls to complete (limited time)...');
      await new Promise(resolve => setTimeout(resolve, 5000)); // Just 5 seconds
    } else {
      console.error(`\nHomepage is not accessible: ${simpleResults.error}`);
    }
    
    // Generate report
    const endTime = new Date();
    const scanDuration = (endTime - startTime) / 1000;
    
    console.log('\n================================');
    console.log('SCAN RESULTS');
    console.log('================================');
    console.log(`Pages visited: ${pages.size}`);
    console.log(`Internal links found: ${internalLinks.size}`);
    console.log(`Broken links: ${brokenLinks.length}`);
    console.log(`Dead-end buttons: ${deadEndButtons.length}`);
    console.log(`Scan duration: ${scanDuration} seconds`);
    
    // Log broken links
    if (brokenLinks.length > 0) {
      console.log('\n--------------------------------');
      console.log('BROKEN LINKS');
      console.log('--------------------------------');
      brokenLinks.forEach((link, index) => {
        console.log(`${index + 1}. ${link.url}`);
        console.log(`   Found on: ${link.parentUrl || 'Direct access'}`);
        console.log(`   Status: ${link.status}`);
        console.log(`   Message: ${link.message}`);
        console.log('   ');
      });
    }
    
    // Log dead-end buttons
    if (deadEndButtons.length > 0) {
      console.log('\n--------------------------------');
      console.log('DEAD-END BUTTONS');
      console.log('--------------------------------');
      deadEndButtons.forEach((button, index) => {
        console.log(`${index + 1}. ${button.element} "${button.text}"`);
        console.log(`   Found on: ${button.url}`);
        console.log(`   Location: ${button.location}`);
        console.log('   ');
      });
    }
    
    // Save report to file
    const report = {
      meta: {
        baseUrl: config.baseUrl,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: scanDuration,
        maxDepth: config.maxDepth
      },
      summary: {
        pagesVisited: pages.size,
        internalLinksFound: internalLinks.size,
        brokenLinks: brokenLinks.length,
        deadEndButtons: deadEndButtons.length
      },
      homepage: simpleResults, // Add the homepage check results
      brokenLinks,
      deadEndButtons,
      visitedPages: Array.from(pages)
    };
    
    fs.writeFileSync(config.outputFile, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${config.outputFile}`);
    
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});