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
    // Launch a new browser instance using the serverless-friendly chromium package.
    // Use the recommended 'new' headless mode for modern Puppeteer versions for better stability.
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      // FIX: Cast 'new' to 'any' to bypass a TypeScript type error. The 'new' value is correct
      // for modern Puppeteer versions but may not be reflected in the project's type definitions.
      headless: 'new' as any,
    });

    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Add a small, crucial delay. This gives client-side scripts like the 
    // Tailwind CDN time to execute and apply styles before the PDF is generated.
    // This prevents a common race condition where the PDF is created before styling is complete.
    await new Promise(r => setTimeout(r, 500));
    
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