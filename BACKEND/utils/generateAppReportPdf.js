// utils/generateAppReportPdf.js
import puppeteer from "puppeteer";

export async function generateAppReportPdf(report, res) {
  console.log(report)
  try {
    // Extract data for easier access
    const ps = report.playstore || {};
    const ds = ps.datasafety || {};
    const apkMeta = report.apkMeta || {};
    const cert = report.certificates?.[0] || {};
    const confidence = report.confidence || {};

    // Format dates
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    };

    // Format file size
    const formatFileSize = (bytes) => {
      if (!bytes) return "N/A";
      return (bytes / 1024 / 1024).toFixed(2) + " MB";
    };

    // Risk level styling
    const getRiskLevelClass = () => {
      const riskScore = report.risk_score || 0;
      if (riskScore >= 0.7) return "risk-high";
      if (riskScore >= 0.4) return "risk-medium";
      return "risk-low";
    };

    const riskLevelClass = getRiskLevelClass();

    const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 25px; 
            color: #222; 
            line-height: 1.4;
          }
          h1 { 
            text-align: center; 
            color: #1a73e8; 
            margin-bottom: 30px;
            border-bottom: 2px solid #1a73e8;
            padding-bottom: 10px;
          }
          h2 { 
            margin-top: 25px; 
            color: #444; 
            border-bottom: 1px solid #ddd; 
            padding-bottom: 5px; 
            font-size: 18px;
          }
          h3 {
            font-size: 16px;
            color: #555;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
            margin-bottom: 15px;
            font-size: 12px; 
            page-break-inside: avoid;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            vertical-align: top;
          }
          th { 
            background: #f4f4f4; 
            font-weight: bold;
          }
          .risk-low { background: #d4edda; }
          .risk-medium { background: #fff3cd; }
          risk-high { background: #f8d7da; }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .two-column {
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }
          .column {
            flex: 1;
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            font-size: 11px; 
            color: gray; 
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          .verdict {
            font-weight: bold;
            font-size: 16px;
            padding: 8px;
            border-radius: 4px;
            text-align: center;
            margin: 10px 0;
          }
          .suspicious {
            background-color: #f8d7da;
          }
          .safe {
            background-color: #d4edda;
          }
          .warning {
            background-color: #fff3cd;
          }
          .break-before {
            page-break-before: always;
          }
          .data-table {
            font-size: 11px;
          }
          .monospace {
            font-family: monospace;
            font-size: 11px;
          }
          .text-center {
            text-align: center;
          }
          .mb-20 {
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <h1>📱 App Security Analysis Report</h1>
        
        <div class="section">
          <div class="two-column">
            <div class="column">
              <h2>📌 App Information</h2>
              <p><b>App Name:</b> ${ps.appName || "N/A"}</p>
              <p><b>Package ID:</b> ${report.appId || "N/A"}</p>
              <p><b>Developer:</b> ${ps.developer || "N/A"}</p>
              <p><b>Category:</b> ${
                (ps.categories || []).map((c) => c.name).join(", ") || "N/A"
              }</p>
              <p><b>Android Version:</b> ${ps.androidVersion || "N/A"}</p>
              <p><b>Installs:</b> ${ps.installs || "N/A"}</p>
              <p><b>Rating:</b> ${ps.score || "N/A"} (${
      ps.totalReviews || 0
    } reviews)</p>
            </div>
            <div class="column">
              <h2>🚨 Risk Assessment</h2>
              <div class="verdict ${riskLevelClass}">
                ${report.verdict || "No verdict"}
              </div>
              <p><b>Risk Score:</b> ${(report.risk_score * 100 || 0).toFixed(
                2
              )}%</p>
              <p><b>Safe Confidence:</b> ${(confidence.safe * 100 || 0).toFixed(
                2
              )}%</p>
              <p><b>Fake Confidence:</b> ${(confidence.fake * 100 || 0).toFixed(
                2
              )}%</p>
              <p><b>Report Date:</b> ${formatDate(report.createdAt)}</p>
            </div>
          </div>
        </div>

        <div class="section break-before">
          <h2>📦 APK Information</h2>
          <table>
            <tr>
              <th>APK Name</th>
              <th>Package Name</th>
              <th>Version</th>
              <th>Size</th>
              <th>SHA256</th>
            </tr>
            <tr>
              <td>${apkMeta.apk_name || "N/A"}</td>
              <td>${apkMeta.package_name || "N/A"}</td>
              <td>${apkMeta.version_name || "N/A"} (${
      apkMeta.version_code || "N/A"
    })</td>
              <td>${formatFileSize(apkMeta.size_bytes)}</td>
              <td class="monospace">${apkMeta.sha256 || "N/A"}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>🔐 Certificate Information</h2>
          <table>
            <tr>
              <th>Subject</th>
              <th>Issuer</th>
              <th>Serial Number</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Algorithm</th>
            </tr>
            <tr>
              <td>${cert.subject || "N/A"}</td>
              <td>${cert.issuer || "N/A"}</td>
              <td class="monospace">${cert.serial_number || "N/A"}</td>
              <td>${formatDate(cert.not_before)}</td>
              <td>${formatDate(cert.not_after)}</td>
              <td>${cert.signature_algorithm || "N/A"}</td>
            </tr>
          </table>
        </div>

        <div class="section break-before">
          <h2>🔑 Permissions Analysis</h2>
          <p><b>Total Permissions:</b> ${
            report.permissions?.all?.length || 0
          }</p>
          <p><b>Dangerous Permissions:</b> ${
            report.permissions?.dangerous?.length || 0
          }</p>
          
          <h3>Dangerous Permissions</h3>
          <table>
            <tr>
              <th>Permission</th>
            </tr>
            ${
              report.permissions?.dangerous
                ?.map(
                  (p) => `
              <tr class="suspicious">
                <td>${p}</td>
              </tr>
            `
                )
                .join("") || "<tr><td>No dangerous permissions found</td></tr>"
            }
          </table>
          
          <h3>Suspicious Permissions</h3>
          <table>
            <tr>
              <th>Permission</th>
              <th>Type</th>
            </tr>
            ${
              ps.suspiciousPermissions
                ?.map(
                  (p) => `
              <tr class="suspicious">
                <td>${p.permission}</td>
                <td>${p.type}</td>
              </tr>
            `
                )
                .join("") ||
              '<tr><td colspan="2">No suspicious permissions found</td></tr>'
            }
          </table>
        </div>

        <div class="section break-before">
          <h2>📊 Data Safety</h2>
          
          <h3>Security Practices</h3>
          <table>
            <tr>
              <th>Practice</th>
              <th>Description</th>
            </tr>
            ${
              ds.securityPractices
                ?.map(
                  (p) => `
              <tr>
                <td>${p.practice}</td>
                <td>${p.description}</td>
              </tr>
            `
                )
                .join("") ||
              '<tr><td colspan="2">No security practices information</td></tr>'
            }
          </table>
          
          <h3>Collected Data</h3>
          <table class="data-table">
            <tr>
              <th>Data Type</th>
              <th>Purpose</th>
              <th>Optional</th>
            </tr>
            ${
              ds.collectedData
                ?.map(
                  (d) => `
              <tr>
                <td>${d.data} (${d.type})</td>
                <td>${d.purpose}</td>
                <td>${d.optional ? "Yes" : "No"}</td>
              </tr>
            `
                )
                .join("") ||
              '<tr><td colspan="3">No data collection information</td></tr>'
            }
          </table>
          
          <h3>Shared Data</h3>
          <table class="data-table">
            <tr>
              <th>Data Type</th>
              <th>Purpose</th>
              <th>Optional</th>
            </tr>
            ${
              ds.sharedData
                ?.map(
                  (d) => `
              <tr>
                <td>${d.data} (${d.type})</td>
                <td>${d.purpose}</td>
                <td>${d.optional ? "Yes" : "No"}</td>
              </tr>
            `
                )
                .join("") ||
              '<tr><td colspan="3">No data sharing information</td></tr>'
            }
          </table>
        </div>

        <div class="section break-before">
          <h2>⭐ Reviews Analysis</h2>
          <p><b>Total Reviews:</b> ${ps.totalReviews || 0}</p>
          <p><b>Average Rating:</b> ${ps.score || "N/A"}</p>
          <p><b>Reviews with >3 Stars:</b> ${ps.reviewMoreThan3 || 0}</p>
          <p><b>Suspicious Reviews:</b> ${ps.suspiciousReviews?.length || 0}</p>
          
          <h3>Suspicious Reviews</h3>
          <table>
            <tr>
              <th>User</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Review</th>
            </tr>
            ${
              ps.suspiciousReviews
                ?.map(
                  (r) => `
              <tr class="suspicious">
                <td>${r.userName}</td>
                <td>${r.score} ⭐</td>
                <td>${formatDate(r.date)}</td>
                <td>${r.text}</td>
              </tr>
            `
                )
                .join("") ||
              '<tr><td colspan="4">No suspicious reviews found</td></tr>'
            }
          </table>
        </div>

        <div class="section break-before">
          <h2>🔍 Sandbox Analysis</h2>
          <table>
            <tr>
              <th>Result Type</th>
              <th>Count</th>
            </tr>
            ${
              report.sandboxResult
                ? Object.entries(report.sandboxResult)
                    .map(
                      ([key, value]) => `
              <tr>
                <td>${key}</td>
                <td>${value}</td>
              </tr>
            `
                    )
                    .join("")
                : '<tr><td colspan="2">No sandbox results available</td></tr>'
            }
          </table>
        </div>

        <div class="footer">
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>This report was automatically generated by App Security Scanner</p>
        </div>
      </body>
    </html>`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    await browser.close();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=app-security-report-${
        report.appId || "unknown"
      }.pdf`
    );

    // Send the PDF
    res.send(pdfBuffer);
  } catch (err) {
    // console.error("PDF Generation Error:", err.message);
    res
      .status(500)
      .json({ error: "Failed to generate PDF", details: err.message });
  }
}
