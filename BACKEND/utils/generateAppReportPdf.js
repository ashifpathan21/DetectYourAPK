// utils/generateAppReportPdf.js
import PDFDocument from "pdfkit";

/**
 * Lightweight helpers — PDFKit me HTML/CSS nahi hota,
 * isliye headings, tables, spacing sab manually draw kar rahe hain.
 */

const COLORS = {
  primary: "#1a73e8",
  text: "#222222",
  border: "#dddddd",
  thBg: "#f4f4f4",
  riskLow: "#d4edda",
  riskMed: "#fff3cd",
  riskHigh: "#f8d7da",
  suspicious: "#f8d7da",
  safe: "#d4edda",
  warning: "#fff3cd",
  gray: "#888888",
};

const PAGE = {
  margin: 40,
  width: 595.28, // A4 width pt
  height: 841.89, // A4 height pt
};

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString();
}

function formatFileSize(bytes) {
  if (!bytes) return "N/A";
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function riskClass(score = 0) {
  if (score >= 0.7) return "high";
  if (score >= 0.4) return "medium";
  return "low";
}

function riskColor(score = 0) {
  const cls = riskClass(score);
  if (cls === "high") return COLORS.riskHigh;
  if (cls === "medium") return COLORS.riskMed;
  return COLORS.riskLow;
}

function moveDown(doc, lines = 1) {
  doc.moveDown(lines);
}

/**
 * Page-break safe text rendering
 */
function ensureSpace(doc, needed = 80) {
  const y = doc.y;
  if (y + needed > PAGE.height - PAGE.margin) {
    doc.addPage();
  }
}

function drawHr(doc, y = null, color = COLORS.border) {
  const x = PAGE.margin;
  const width = PAGE.width - PAGE.margin * 2;
  const yy = y ?? doc.y + 4;
  doc
    .save()
    .moveTo(x, yy)
    .lineTo(x + width, yy)
    .lineWidth(1)
    .strokeColor(color)
    .stroke()
    .restore();
  doc.moveDown(0.8);
}

/**
 * Heading styles
 */
function title(doc, text) {
  ensureSpace(doc, 50);
  doc.fontSize(22).fillColor(COLORS.primary).text(text, { align: "center" });
  drawHr(doc);
  doc.fillColor(COLORS.text);
}

function h2(doc, text) {
  ensureSpace(doc, 40);
  doc.fontSize(16).fillColor(COLORS.text).text(text);
  drawHr(doc, null, COLORS.border);
}

function h3(doc, text) {
  ensureSpace(doc, 30);
  doc.fontSize(13).text(text);
  moveDown(doc, 0.25);
}

/**
 * Key: Value lines (wrap-safe)
 */
function kv(doc, key, value) {
  ensureSpace(doc, 20);
  doc
    .fontSize(11.5)
    .fillColor(COLORS.text)
    .text(`${key}: `, { continued: true, underline: false, width: 140 })
    .font("Helvetica-Bold")
    .text(String(value ?? "N/A"))
    .font("Helvetica");
}

/**
 * Table renderer (simple, wrap-aware, auto page-break)
 */
function drawTable(
  doc,
  { headers, rows, columnWidths, rowBg = null, monospaceCols = [] }
) {
  const x = PAGE.margin;
  let y = doc.y;

  const totalWidth = PAGE.width - PAGE.margin * 2;
  const widths =
    columnWidths && columnWidths.length === headers.length
      ? columnWidths
      : new Array(headers.length).fill(totalWidth / headers.length);

  const cellPadding = 6;

  const drawCell = (text, colIndex, isHeader = false, bg = null) => {
    const cellX = x + widths.slice(0, colIndex).reduce((a, b) => a + b, 0);
    const cellW = widths[colIndex];
    const options = { width: cellW - cellPadding * 2 };

    // background
    if (bg) {
      doc.save().rect(cellX, y, cellW, 18).fillColor(bg).fill().restore();
    }

    // border
    doc
      .save()
      .rect(cellX, y, cellW, 18)
      .lineWidth(0.8)
      .strokeColor(COLORS.border)
      .stroke()
      .restore();

    // text
    const fontToUse =
      monospaceCols && monospaceCols.includes(colIndex)
        ? "Courier"
        : "Helvetica";
    doc
      .font(isHeader ? "Helvetica-Bold" : fontToUse)
      .fontSize(10.5)
      .fillColor(COLORS.text)
      .text(String(text ?? "N/A"), cellX + cellPadding, y + 4, options);
  };

  // Ensure space for header + at least one row
  ensureSpace(doc, 50);

  // header
  headers.forEach((h, i) => drawCell(h, i, true, COLORS.thBg));
  y += 18;

  // rows
  rows.forEach((row, rIdx) => {
    // page break check per row
    if (y + 20 > PAGE.height - PAGE.margin) {
      doc.addPage();
      y = PAGE.margin;
      // draw header again
      headers.forEach((h, i) => drawCell(h, i, true, COLORS.thBg));
      y += 18;
    }

    const bg = typeof rowBg === "function" ? rowBg(row, rIdx) : rowBg;
    row.forEach((cell, cIdx) => drawCell(cell, cIdx, false, bg));
    y += 18;
  });

  doc.y = y + 8; // move cursor below table
}

/**
 * Chip-like verdict box
 */
function verdictChip(doc, text, score) {
  ensureSpace(doc, 28);
  const chipW = 300;
  const chipH = 22;
  const x = PAGE.margin;
  const y = doc.y;

  const bg = riskColor(score);
  doc.save().roundedRect(x, y, chipW, chipH, 6).fillColor(bg).fill().restore();

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor(COLORS.text)
    .text(text ?? "No verdict", x + 10, y + 5, { width: chipW - 20 });

  doc.moveDown(1.2);
}

/**
 * Main export: generate PDF exactly with same sections as your HTML version
 */
export async function generateAppReportPdf(report, res) {
  const ps = report.playstore || {};
  const ds = ps.datasafety || {};
  const apkMeta = report.apkMeta || {};
  const cert = report.certificates?.[0] || {};
  const confidence = report.confidence || {};

  try {
    const doc = new PDFDocument({
      margin: PAGE.margin,
      size: "A4",
      info: {
        Title: "App Security Analysis Report",
        Author: "App Security Scanner",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=app-security-report-${
        report.appId || "unknown"
      }.pdf`
    );
    doc.pipe(res);

    // Title
    title(doc, "📱 App Security Analysis Report");

    /**
     * Section: App Information & Risk (two columns feel)
     * We'll render sequentially but grouped to feel similar.
     */
    h2(doc, "📌 App Information");
    kv(doc, "App Name", ps.appName || "N/A");
    kv(doc, "Package ID", report.appId || "N/A");
    kv(doc, "Developer", ps.developer || "N/A");
    kv(
      doc,
      "Category",
      (ps.categories || []).map((c) => c.name).join(", ") || "N/A"
    );
    kv(doc, "Android Version", ps.androidVersion || "N/A");
    kv(doc, "Installs", ps.installs || "N/A");
    kv(doc, "Rating", `${ps.score || "N/A"} (${ps.totalReviews || 0} reviews)`);
    moveDown(doc, 0.5);

    h2(doc, "🚨 Risk Assessment");
    verdictChip(doc, report.verdict || "No verdict", report.risk_score || 0);
    kv(doc, "Risk Score", `${((report.risk_score || 0) * 100).toFixed(2)}%`);
    kv(doc, "Safe Confidence", `${((confidence.safe || 0) * 100).toFixed(2)}%`);
    kv(doc, "Fake Confidence", `${((confidence.fake || 0) * 100).toFixed(2)}%`);
    kv(doc, "Report Date", formatDate(report.createdAt));

    // APK Information (table)
    h2(doc, "📦 APK Information");
    drawTable(doc, {
      headers: ["APK Name", "Package Name", "Version", "Size", "SHA256"],
      columnWidths: [
        120,
        120,
        100,
        60,
        PAGE.width - PAGE.margin * 2 - (120 + 120 + 100 + 60),
      ],
      rows: [
        [
          apkMeta.apk_name || "N/A",
          apkMeta.package_name || "N/A",
          `${apkMeta.version_name || "N/A"} (${apkMeta.version_code || "N/A"})`,
          formatFileSize(apkMeta.size_bytes),
          apkMeta.sha256 || "N/A",
        ],
      ],
      monospaceCols: [4],
    });

    // Certificate (table)
    h2(doc, "🔐 Certificate Information");
    drawTable(doc, {
      headers: [
        "Subject",
        "Issuer",
        "Serial Number",
        "Valid From",
        "Valid To",
        "Algorithm",
      ],
      columnWidths: [110, 110, 90, 70, 70, 70],
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
      monospaceCols: [2],
    });

    // Permissions
    h2(doc, "🔑 Permissions Analysis");
    kv(doc, "Total Permissions", report.permissions?.all?.length || 0);
    kv(
      doc,
      "Dangerous Permissions",
      report.permissions?.dangerous?.length || 0
    );
    moveDown(doc, 0.3);

    h3(doc, "Dangerous Permissions");
    {
      const rows = report.permissions?.dangerous?.length
        ? report.permissions.dangerous.map((p) => [p])
        : [["No dangerous permissions found"]];
      drawTable(doc, {
        headers: ["Permission"],
        rows,
        columnWidths: [PAGE.width - PAGE.margin * 2],
        rowBg: (row) =>
          row[0] === "No dangerous permissions found"
            ? null
            : COLORS.suspicious,
      });
    }

    h3(doc, "Suspicious Permissions");
    {
      const rows = ps.suspiciousPermissions?.length
        ? ps.suspiciousPermissions.map((p) => [p.permission, p.type])
        : [["No suspicious permissions found", ""]];
      drawTable(doc, {
        headers: ["Permission", "Type"],
        rows,
        columnWidths: [350, PAGE.width - PAGE.margin * 2 - 350],
        rowBg: (row) =>
          row[0] === "No suspicious permissions found"
            ? null
            : COLORS.suspicious,
      });
    }

    // Data Safety
    h2(doc, "📊 Data Safety");
    h3(doc, "Security Practices");
    {
      const rows = ds.securityPractices?.length
        ? ds.securityPractices.map((p) => [p.practice, p.description])
        : [["No security practices information", ""]];
      drawTable(doc, {
        headers: ["Practice", "Description"],
        rows,
        columnWidths: [160, PAGE.width - PAGE.margin * 2 - 160],
      });
    }

    h3(doc, "Collected Data");
    {
      const rows = ds.collectedData?.length
        ? ds.collectedData.map((d) => [
            `${d.data} (${d.type})`,
            d.purpose,
            d.optional ? "Yes" : "No",
          ])
        : [["No data collection information", "", ""]];
      drawTable(doc, {
        headers: ["Data Type", "Purpose", "Optional"],
        rows,
        columnWidths: [220, 240, PAGE.width - PAGE.margin * 2 - (220 + 240)],
      });
    }

    h3(doc, "Shared Data");
    {
      const rows = ds.sharedData?.length
        ? ds.sharedData.map((d) => [
            `${d.data} (${d.type})`,
            d.purpose,
            d.optional ? "Yes" : "No",
          ])
        : [["No data sharing information", "", ""]];
      drawTable(doc, {
        headers: ["Data Type", "Purpose", "Optional"],
        rows,
        columnWidths: [220, 240, PAGE.width - PAGE.margin * 2 - (220 + 240)],
      });
    }

    // Reviews
    h2(doc, "⭐ Reviews Analysis");
    kv(doc, "Total Reviews", ps.totalReviews || 0);
    kv(doc, "Average Rating", ps.score || "N/A");
    kv(doc, "Reviews with >3 Stars", ps.reviewMoreThan3 || 0);
    kv(doc, "Suspicious Reviews", ps.suspiciousReviews?.length || 0);
    moveDown(doc, 0.3);

    h3(doc, "Suspicious Reviews");
    {
      const rows = ps.suspiciousReviews?.length
        ? ps.suspiciousReviews.map((r) => [
            r.userName,
            `${r.score} ⭐`,
            formatDate(r.date),
            r.text,
          ])
        : [["No suspicious reviews found", "", "", ""]];
      drawTable(doc, {
        headers: ["User", "Rating", "Date", "Review"],
        rows,
        columnWidths: [
          120,
          60,
          80,
          PAGE.width - PAGE.margin * 2 - (120 + 60 + 80),
        ],
        rowBg: (row) =>
          row[0] === "No suspicious reviews found" ? null : COLORS.suspicious,
      });
    }

    // Sandbox
    h2(doc, "🔍 Sandbox Analysis");
    {
      const entries = report.sandboxResult
        ? Object.entries(report.sandboxResult)
        : [];
      const rows =
        entries.length > 0
          ? entries.map(([k, v]) => [k, v])
          : [["No sandbox results available", ""]];
      drawTable(doc, {
        headers: ["Result Type", "Count"],
        rows,
        columnWidths: [300, PAGE.width - PAGE.margin * 2 - 300],
      });
    }

    // Footer
    moveDown(doc, 1.5);
    drawHr(doc);
    doc
      .fontSize(10)
      .fillColor(COLORS.gray)
      .text(`Generated on: ${new Date().toLocaleString()}`, {
        align: "center",
      });
    doc
      .fontSize(10)
      .fillColor(COLORS.gray)
      .text("This report was automatically generated by App Security Scanner", {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error("PDFKit Error:", err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Failed to generate PDF", details: err.message });
    }
  }
}
