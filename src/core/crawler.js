import * as cheerio from 'cheerio';
import { absoluteUrl, request } from './http.js';

export async function crawl(startUrl, options = {}) {
  const maxPages = options.maxPages ?? 30;
  const queue = [new URL(startUrl)];
  const seen = new Set();
  const pages = [];
  const rootHost = new URL(startUrl).host;

  while (queue.length && pages.length < maxPages) {
    const url = queue.shift();
    if (seen.has(url.href) || url.host !== rootHost) continue;
    seen.add(url.href);

    let response;
    try { response = await request(url, options); }
    catch (error) { pages.push({ url: url.href, error: error.message }); continue; }

    const page = { url: url.href, status: response.status, headers: response.headers, links: [], forms: [], text: response.text };
    const type = response.headers['content-type'] || '';

    if (type.includes('text/html')) {
      const $ = cheerio.load(response.text);
      $('a[href]').each((_, el) => {
        const u = absoluteUrl(url, $(el).attr('href'));
        if (u && u.host === rootHost) {
          page.links.push(u.href);
          if (!seen.has(u.href)) queue.push(u);
        }
      });
      $('form').each((_, el) => {
        const action = absoluteUrl(url, $(el).attr('action') || url.href);
        if (!action || action.host !== rootHost) return;
        const inputs = [];
        $(el).find('input, textarea, select').each((__, input) => {
          const name = $(input).attr('name');
          if (name) inputs.push({ name, type: $(input).attr('type') || 'text' });
        });
        page.forms.push({ action: action.href, method: ($(el).attr('method') || 'GET').toUpperCase(), inputs });
      });
    }
    pages.push(page);
  }
  return pages;
}
