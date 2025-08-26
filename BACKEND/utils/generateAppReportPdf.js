import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium"; // lightweight chromium build for serverless

export async function generateAppReportPdf(report, res) {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(), // 🔑 Render पर सही binary path
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setContent(
      `<h1>${report.appId}</h1><p>Verdict: ${report.verdict}</p>`,
      { waitUntil: "domcontentloaded" }
    );

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF Generation Error:", err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Failed to generate PDF", details: err.message });
    }
  }
}
