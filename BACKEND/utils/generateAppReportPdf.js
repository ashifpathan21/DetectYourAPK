import puppeteer from "puppeteer";

export async function generateAppReportPdf(report, res) {
    try{ // Simple Pie Chart data for permissions
  const sandboxData = report.sandboxResult || {};

  const pieData = Object.entries(sandboxData)
    .map(([key, value]) => ({
      name: key,
      value: value,
    }))
    .filter((item) => item.value > 0);
 
    const labels = Object.keys(sandboxData);
    const data = Object.values(sandboxData);

  const html = `
  <html>
    <head>
      <title>App Security Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 30px; color: #333; }
        h1 { text-align: center; color: #1a73e8; }
        h2 { margin-top: 30px; color: #444; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f4f4f4; }
        .risk-low { background: #d4edda; }
        .risk-medium { background: #fff3cd; }
        .risk-high { background: #f8d7da; }
        .section { margin-bottom: 30px; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: gray; }
        .chart { text-align:center; margin-top:20px; }
      </style>
    </head>
    <body>
      <h1>📱 App Security Report</h1>

      <div class="section">
        <h2>📌 App Information</h2>
        <p><b>App Name:</b> ${report.appName || "N/A"}</p>
        <p><b>Package ID:</b> ${report.appId}</p>
        <p><b>Category:</b> ${
          report.categories?.map((c) => c.name).join(", ") || "N/A"
        }</p>
        <p><b>Android Version:</b> ${report.androidVersion || "Unknown"}</p>
      </div>

      <div class="section">
        <h2>👨‍💻 Developer Information</h2>
        <p><b>Developer:</b> ${report.developer}</p>
        <p><b>Email:</b> ${report.developerEmail || "N/A"}</p>
        <p><b>Website:</b> ${report.developerWebsite || "N/A"}</p>
        <p><b>Address:</b> ${report.developerLegalAddress || "N/A"}</p>
      </div>

      <div class="section">
        <h2>📊 Store Information</h2>
        <p><b>Installs:</b> ${report.installs}</p>
        <p><b>Total Reviews:</b> ${report.totalReviews}</p>
        <p><b>Average Score:</b> ${report.score}</p>
        ${
          report.privacyPolicyUrl
            ? `<p><b>Privacy Policy:</b> <a href="${report.privacyPolicyUrl}">${report.privacyPolicyUrl}</a></p>`
            : ""
        }
      </div>

      <div class="section">
        <h2>🛡 Data Safety</h2>
        <h3>Collected Data</h3>
        <table>
          <tr><th>Data Type</th><th>Purpose</th></tr>
          ${
            report.datasafety?.collectedData
              ?.map(
                (d) =>
                  `<tr><td>${d?.data || "N/A"}</td><td>${
                    d?.purpose || "N/A"
                  }</td></tr>`
              )
              .join("") || "<tr><td colspan='2'>No data</td></tr>"
          }
        </table>

        <h3>Shared Data</h3>
        <table>
          <tr><th>Data Type</th><th>Purpose</th></tr>
          ${
            report.datasafety?.sharedData
              ?.map(
                (d) =>
                  `<tr><td>${d?.data || "N/A"}</td><td>${
                    d?.purpose|| "N/A"
                  }</td></tr>`
              )
              .join("") || "<tr><td colspan='2'>No data</td></tr>"
          }
        </table>
      </div>

      <div class="section">
        <h2>🚨 Risk Analysis</h2>
        <table>
          <tr>
            <th>Risk Level</th>
            <th>Score</th>
            <th>Summary</th>
          </tr>
          <tr class="${
            report.riskLevel === "HIGH"
              ? "risk-high"
              : report.riskLevel === "MEDIUM"
              ? "risk-medium"
              : "risk-low"
          }">
            <td>${report.riskLevel}</td>
            <td>${report.riskScore ?? "N/A"}</td>
            <td>${report.riskSummary || "No summary available."}</td>
          </tr>
        </table>
      </div>

           <div class="section chart">
        <h2>📊 Sandbox Results</h2>
        <canvas id="pieChart" width="300" height="300"></canvas>
      </div>

      <div class="footer">
        Generated on: ${new Date().toLocaleString()}
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script>
        const sandboxData = ${JSON.stringify(report.sandboxResult || {})};

        const labels = Object.keys(sandboxData);
        const data = Object.values(sandboxData);

        const ctx = document.getElementById('pieChart');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: [
                '#dc3545', // red
                '#ffc107', // yellow
                '#28a745', // green
                '#6c757d', // gray
                '#007bff', // blue
                '#17a2b8', // cyan
                '#6610f2', // purple
              ].slice(0, labels.length) // jitne labels utne colors
            }]
          }
        });
      </script>

    </body>
  </html>`;

  // Puppeteer convert HTML to PDF
  const browser = await puppeteer.launch({
    headless: "new", // for latest versions
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  // Send PDF response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=app-report.pdf");
  res.send(pdfBuffer);}catch(err){
    console.log(err.message)
  }
}
