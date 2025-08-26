// utils/generateAppReportPdf.js
import PDFDocument from "pdfkit";
import { format } from "date-fns";

export async function generateAppReportPdf(report, res) {
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
      return format(new Date(dateString), "yyyy-MM-dd");
    };

    // Format file size
    const formatFileSize = (bytes) => {
      if (!bytes) return "N/A";
      return (bytes / 1024 / 1024).toFixed(2) + " MB";
    };

    // Risk level styling
    const getRiskLevelColor = () => {
      const riskScore = report.risk_score || 0;
      if (riskScore >= 0.7) return "#f8d7da"; // high
      if (riskScore >= 0.4) return "#fff3cd"; // medium
      return "#d4edda"; // low
    };

    const riskLevelColor = getRiskLevelColor();

    // Create a PDF document
    const doc = new PDFDocument({
      margin: { top: 20, bottom: 20, left: 15, right: 15 },
      size: "A4",
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=app-security-report-${
        report.appId || "unknown"
      }.pdf`
    );

    // Pipe the PDF to the response
    doc.pipe(res);

    // Title
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#1a73e8")
      .text("📱 App Security Analysis Report", { align: "center" })
      .moveDown(0.5);

    // Draw a line under the title
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .lineWidth(2)
      .strokeColor("#1a73e8")
      .stroke();

    doc.moveDown(1);

    // App Information and Risk Assessment in two columns
    const col1Width = 250;
    const col2Width = 250;
    const startY = doc.y;

    // App Information
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("black")
      .text("📌 App Information", doc.page.margins.left, startY);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        `App Name: ${ps.appName || "N/A"}`,
        doc.page.margins.left,
        doc.y + 5
      )
      .text(
        `Package ID: ${report.appId || "N/A"}`,
        doc.page.margins.left,
        doc.y + 5
      )
      .text(
        `Developer: ${ps.developer || "N/A"}`,
        doc.page.margins.left,
        doc.y + 5
      )
      .text(
        `Category: ${
          (ps.categories || []).map((c) => c.name).join(", ") || "N/A"
        }`,
        doc.page.margins.left,
        doc.y + 5
      )
      .text(
        `Android Version: ${ps.androidVersion || "N/A"}`,
        doc.page.margins.left,
        doc.y + 5
      )
      .text(
        `Installs: ${ps.installs || "N/A"}`,
        doc.page.margins.left,
        doc.y + 5
      )
      .text(
        `Rating: ${ps.score || "N/A"} (${ps.totalReviews || 0} reviews)`,
        doc.page.margins.left,
        doc.y + 5
      );

    // Risk Assessment
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(
        "🚨 Risk Assessment",
        doc.page.margins.left + col1Width + 20,
        startY
      );

    // Risk verdict box
    doc
      .rect(doc.page.margins.left + col1Width + 20, doc.y + 5, col2Width, 20)
      .fill(riskLevelColor);

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("black")
      .text(
        report.verdict || "No verdict",
        doc.page.margins.left + col1Width + 25,
        doc.y + 10,
        {
          width: col2Width - 10,
          align: "center",
        }
      );

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        `Risk Score: ${(report.risk_score * 100 || 0).toFixed(2)}%`,
        doc.page.margins.left + col1Width + 20,
        doc.y + 15
      )
      .text(
        `Safe Confidence: ${(confidence.safe * 100 || 0).toFixed(2)}%`,
        doc.page.margins.left + col1Width + 20,
        doc.y + 5
      )
      .text(
        `Fake Confidence: ${(confidence.fake * 100 || 0).toFixed(2)}%`,
        doc.page.margins.left + col1Width + 20,
        doc.y + 5
      )
      .text(
        `Report Date: ${formatDate(report.createdAt)}`,
        doc.page.margins.left + col1Width + 20,
        doc.y + 5
      );

    // Add page break
    doc.addPage();

    // APK Information
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#444")
      .text("📦 APK Information", doc.page.margins.left, doc.y)
      .moveDown(0.5);

    // Draw a line under the section title
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .lineWidth(1)
      .strokeColor("#ddd")
      .stroke();

    doc.moveDown(0.5);

    // APK table
    const apkTable = {
      headers: ["APK Name", "Package Name", "Version", "Size", "SHA256"],
      rows: [
        [
          apkMeta.apk_name || "N/A",
          apkMeta.package_name || "N/A",
          `${apkMeta.version_name || "N/A"} (${apkMeta.version_code || "N/A"})`,
          formatFileSize(apkMeta.size_bytes),
          apkMeta.sha256 || "N/A",
        ],
      ],
    };

    // Draw APK table
    drawTable(doc, apkTable);

    // Certificate Information
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#444")
      .text("🔐 Certificate Information", doc.page.margins.left, doc.y + 15)
      .moveDown(0.5);

    // Draw a line under the section title
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .lineWidth(1)
      .strokeColor("#ddd")
      .stroke();

    doc.moveDown(0.5);

    // Certificate table
    const certTable = {
      headers: [
        "Subject",
        "Issuer",
        "Serial Number",
        "Valid From",
        "Valid To",
        "Algorithm",
      ],
      rows: [
        [
          cert.subject || "N/A",
          cert.issuer || "N/A",
          cert.serial_number || "N/A",
          formatDate(cert.not_before),
          formatDate(cert.not_after),
          cert.signature_algorithm || "N/A",
        ],
      ],
    };

    // Draw certificate table
    drawTable(doc, certTable);

    // Add page break
    doc.addPage();

    // Permissions Analysis
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#444")
      .text("🔑 Permissions Analysis", doc.page.margins.left, doc.y)
      .moveDown(0.5);

    // Draw a line under the section title
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .lineWidth(1)
      .strokeColor("#ddd")
      .stroke();

    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`Total Permissions: ${report.permissions?.all?.length || 0}`)
      .text(
        `Dangerous Permissions: ${report.permissions?.dangerous?.length || 0}`
      )
      .moveDown(0.5);

    // Dangerous Permissions
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#555")
      .text("Dangerous Permissions")
      .moveDown(0.3);

    if (report.permissions?.dangerous?.length > 0) {
      const dangerousPermsTable = {
        headers: ["Permission"],
        rows: report.permissions.dangerous.map((p) => [p]),
      };
      drawTable(doc, dangerousPermsTable, "#f8d7da");
    } else {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("No dangerous permissions found")
        .moveDown(0.5);
    }

    // Suspicious Permissions
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#555")
      .text("Suspicious Permissions")
      .moveDown(0.3);

    if (ps.suspiciousPermissions?.length > 0) {
      const suspiciousPermsTable = {
        headers: ["Permission", "Type"],
        rows: ps.suspiciousPermissions.map((p) => [p.permission, p.type]),
      };
      drawTable(doc, suspiciousPermsTable, "#f8d7da");
    } else {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("No suspicious permissions found")
        .moveDown(0.5);
    }

    // Add page break
    doc.addPage();

    // Data Safety
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#444")
      .text("📊 Data Safety", doc.page.margins.left, doc.y)
      .moveDown(0.5);

    // Draw a line under the section title
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .lineWidth(1)
      .strokeColor("#ddd")
      .stroke();

    doc.moveDown(0.5);

    // Security Practices
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#555")
      .text("Security Practices")
      .moveDown(0.3);

    if (ds.securityPractices?.length > 0) {
      const securityPracticesTable = {
        headers: ["Practice", "Description"],
        rows: ds.securityPractices.map((p) => [p.practice, p.description]),
      };
      drawTable(doc, securityPracticesTable);
    } else {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("No security practices information")
        .moveDown(0.5);
    }

    // Collected Data
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#555")
      .text("Collected Data")
      .moveDown(0.3);

    if (ds.collectedData?.length > 0) {
      const collectedDataTable = {
        headers: ["Data Type", "Purpose", "Optional"],
        rows: ds.collectedData.map((d) => [
          `${d.data} (${d.type})`,
          d.purpose,
          d.optional ? "Yes" : "No",
        ]),
      };
      drawTable(doc, collectedDataTable);
    } else {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("No data collection information")
        .moveDown(0.5);
    }

    // Shared Data
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#555")
      .text("Shared Data")
      .moveDown(0.3);

    if (ds.sharedData?.length > 0) {
      const sharedDataTable = {
        headers: ["Data Type", "Purpose", "Optional"],
        rows: ds.sharedData.map((d) => [
          `${d.data} (${d.type})`,
          d.purpose,
          d.optional ? "Yes" : "No",
        ]),
      };
      drawTable(doc, sharedDataTable);
    } else {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("No data sharing information")
        .moveDown(0.5);
    }

    // Add page break
    doc.addPage();

    // Reviews Analysis
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#444")
      .text("⭐ Reviews Analysis", doc.page.margins.left, doc.y)
      .moveDown(0.5);

    // Draw a line under the section title
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .lineWidth(1)
      .strokeColor("#ddd")
      .stroke();

    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`Total Reviews: ${ps.totalReviews || 0}`)
      .text(`Average Rating: ${ps.score || "N/A"}`)
      .text(`Reviews with >3 Stars: ${ps.reviewMoreThan3 || 0}`)
      .text(`Suspicious Reviews: ${ps.suspiciousReviews?.length || 0}`)
      .moveDown(0.5);

    // Suspicious Reviews
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#555")
      .text("Suspicious Reviews")
      .moveDown(0.3);

    if (ps.suspiciousReviews?.length > 0) {
      const suspiciousReviewsTable = {
        headers: ["User", "Rating", "Date", "Review"],
        rows: ps.suspiciousReviews.map((r) => [
          r.userName,
          `${r.score} ⭐`,
          formatDate(r.date),
          r.text,
        ]),
      };
      drawTable(doc, suspiciousReviewsTable, "#f8d7da");
    } else {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("No suspicious reviews found")
        .moveDown(0.5);
    }

    // Add page break
    doc.addPage();

    // Sandbox Analysis
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#444")
      .text("🔍 Sandbox Analysis", doc.page.margins.left, doc.y)
      .moveDown(0.5);

    // Draw a line under the section title
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .lineWidth(1)
      .strokeColor("#ddd")
      .stroke();

    doc.moveDown(0.5);

    if (report.sandboxResult) {
      const sandboxTable = {
        headers: ["Result Type", "Count"],
        rows: Object.entries(report.sandboxResult).map(([key, value]) => [
          key,
          value,
        ]),
      };
      drawTable(doc, sandboxTable);
    } else {
      doc
        .font("Helvetica")
        .fontSize(10)
        .text("No sandbox results available")
        .moveDown(0.5);
    }

    // Footer
    doc.addPage();
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("gray")
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" })
      .text("This report was automatically generated by App Security Scanner", {
        align: "center",
      });

    // Draw a line above the footer
    doc
      .moveTo(doc.page.margins.left, doc.y - 25)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y - 25)
      .lineWidth(1)
      .strokeColor("#ddd")
      .stroke();

    // Finalize the PDF
    doc.end();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate PDF", details: err.message });
  }
}

// Helper function to draw tables
function drawTable(doc, table, rowColor = null) {
  const tableTop = doc.y;
  const colWidths = [];
  const rowHeight = 15;

  // Calculate column widths based on content
  table.headers.forEach((header, i) => {
    const headerWidth = doc.widthOfString(header) + 10;
    let maxWidth = headerWidth;

    table.rows.forEach((row) => {
      const cellWidth = doc.widthOfString(String(row[i] || "")) + 10;
      if (cellWidth > maxWidth) maxWidth = cellWidth;
    });

    colWidths.push(
      Math.min(
        maxWidth,
        (doc.page.width - doc.page.margins.left - doc.page.margins.right) /
          table.headers.length
      )
    );
  });

  // Draw headers
  let x = doc.page.margins.left;
  table.headers.forEach((header, i) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .rect(x, tableTop, colWidths[i], rowHeight)
      .fill("#f4f4f4")
      .fillColor("black")
      .text(header, x + 5, tableTop + 3, {
        width: colWidths[i] - 10,
        align: "left",
      });
    x += colWidths[i];
  });

  // Draw rows
  table.rows.forEach((row, rowIndex) => {
    x = doc.page.margins.left;
    const y = tableTop + (rowIndex + 1) * rowHeight;

    row.forEach((cell, cellIndex) => {
      if (rowIndex === 0 && rowColor) {
        doc.rect(x, y, colWidths[cellIndex], rowHeight).fill(rowColor);
      }

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("black")
        .text(String(cell || ""), x + 5, y + 3, {
          width: colWidths[cellIndex] - 10,
          align: "left",
        });

      // Draw cell border
      doc.rect(x, y, colWidths[cellIndex], rowHeight).stroke();

      x += colWidths[cellIndex];
    });
  });

  // Update Y position
  doc.y = tableTop + (table.rows.length + 1) * rowHeight + 10;
}
