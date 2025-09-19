
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
    // Launch a new browser instance using the serverless-friendly chromium package
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
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
    return res.status(500).send({ error: 'An error occurred while generating the PDF.', details: error.message });
  } finally {
    // Ensure the browser is closed
    if (browser) {
      await browser.close();
    }
  }
}
