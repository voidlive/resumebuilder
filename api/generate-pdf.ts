
import type { VercelRequest, VercelResponse } from '@vercel/node';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// This is a Vercel Serverless Function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // We only want to handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Method Not Allowed' });
  }

  const { html } = req.body;

  if (!html) {
    return res.status(400).send({ error: 'HTML content is required.' });
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      // FIX: The `chromium.headless` property caused a TypeScript error.
      // Replaced with `'new'`, which is the recommended headless mode for modern Puppeteer versions.
      headless: 'new',
    });

    const page = await browser.newPage();

    // Set page content, waiting only for the DOM to be ready
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // **CRITICAL FIX**: Explicitly wait for the Tailwind JIT CDN script to finish.
    // The script adds a style tag with the 'data-tailwindcss-jit' attribute once it has
    // processed the HTML and applied all Tailwind classes. This is far more reliable
    // than a fixed delay or networkidle, as it confirms styling is 100% complete.
    await page.waitForSelector('style[data-tailwindcss-jit]', { timeout: 15000 });
    
    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    // Set the response headers to trigger a file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    
    // Send the PDF buffer as the response
    return res.status(200).send(pdfBuffer);

  } catch (error: any) {
    console.error('Error generating PDF:', error);
    if (error.name === 'TimeoutError') {
        console.error('Puppeteer timed out waiting for the Tailwind CSS selector. The CDN script might be slow or failing.');
    }
    console.error('Full Error Details:', JSON.stringify(error, null, 2));
    return res.status(500).send({ 
        error: 'An error occurred while generating the PDF.', 
        details: error.message,
        stack: error.stack,
    });
  } finally {
    // Ensure the browser is closed
    if (browser) {
      await browser.close();
    }
  }
}