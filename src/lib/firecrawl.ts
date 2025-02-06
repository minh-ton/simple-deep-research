import FirecrawlApp from '@mendable/firecrawl-js';

export const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
  apiUrl: "https://api.firecrawl.dev",
});
