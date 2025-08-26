// utils/generateAppReportPdf.js
import PDFDocument from "pdfkit";

export async function generateAppReportPdf(report, res) {
  try {
    const ps = report.playstore || {};
    const ds = ps.datasafety || {};
    const apkMeta = report.apkMeta || {};
    const cert = report.certificates?.[0] || {};
    const confidence = report.confidence || {};

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    };

    const formatFileSize = (bytes) => {
      if (!bytes) return "N/A";
      return (bytes / 1024 / 1024).toFixed(2) + " MB";
    };

    // Start PDF
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=app-security-report-${
        report.appId || "unknown"
      }.pdf`
    );
    doc.pipe(res);

    // Title
    doc
      .fontSize(20)
      .fillColor("#1a73e8")
      .text("📱 App Security Analysis Report", {
        align: "center",
      });
    doc.moveDown();

    // Section 1: App Info
    doc
      .fontSize(14)
      .fillColor("black")
      .text("📌 App Information", { underline: true });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(`App Name: ${ps.appName || "N/A"}`)
      .text(`Package ID: ${report.appId || "N/A"}`)
      .text(`Developer: ${ps.developer || "N/A"}`)
      .text(
        `Category: ${
          (ps.categories || []).map((c) => c.name).join(", ") || "N/A"
        }`
      )
      .text(`Android Version: ${ps.androidVersion || "N/A"}`)
      .text(`Installs: ${ps.installs || "N/A"}`)
      .text(`Rating: ${ps.score || "N/A"} (${ps.totalReviews || 0} reviews)`);
    doc.moveDown();

    // Section 2: Risk
    doc.fontSize(14).text("🚨 Risk Assessment", { underline: true });
    doc
      .fontSize(12)
      .text(`Verdict: ${report.verdict || "No verdict"}`)
      .text(`Risk Score: ${(report.risk_score * 100 || 0).toFixed(2)}%`)
      .text(`Safe Confidence: ${(confidence.safe * 100 || 0).toFixed(2)}%`)
      .text(`Fake Confidence: ${(confidence.fake * 100 || 0).toFixed(2)}%`)
      .text(`Report Date: ${formatDate(report.createdAt)}`);
    doc.moveDown();

    // Section 3: APK Info
    doc.fontSize(14).text("📦 APK Information", { underline: true });
    doc
      .fontSize(12)
      .text(`APK Name: ${apkMeta.apk_name || "N/A"}`)
      .text(`Package Name: ${apkMeta.package_name || "N/A"}`)
      .text(
        `Version: ${apkMeta.version_name || "N/A"} (${
          apkMeta.version_code || "N/A"
        })`
      )
      .text(`Size: ${formatFileSize(apkMeta.size_bytes)}`)
      .text(`SHA256: ${apkMeta.sha256 || "N/A"}`);
    doc.moveDown();

    // Section 4: Certificate
    doc.fontSize(14).text("🔐 Certificate Information", { underline: true });
    doc
      .fontSize(12)
      .text(`Subject: ${cert.subject || "N/A"}`)
      .text(`Issuer: ${cert.issuer || "N/A"}`)
      .text(`Serial Number: ${cert.serial_number || "N/A"}`)
      .text(`Valid From: ${formatDate(cert.not_before)}`)
      .text(`Valid To: ${formatDate(cert.not_after)}`)
      .text(`Algorithm: ${cert.signature_algorithm || "N/A"}`);
    doc.moveDown();

    // Section 5: Permissions
    doc.fontSize(14).text("🔑 Permissions Analysis", { underline: true });
    doc
      .fontSize(12)
      .text(`Total Permissions: ${report.permissions?.all?.length || 0}`)
      .text(
        `Dangerous Permissions: ${report.permissions?.dangerous?.length || 0}`
      );
    doc.moveDown(0.5);

    if (report.permissions?.dangerous?.length) {
      doc.text("Dangerous Permissions:");
      report.permissions.dangerous.forEach((p) => doc.text(` - ${p}`));
    }
    doc.moveDown();

    if (ps.suspiciousPermissions?.length) {
      doc.text("Suspicious Permissions:");
      ps.suspiciousPermissions.forEach((p) =>
        doc.text(` - ${p.permission} (${p.type})`)
      );
    }
    doc.moveDown();

    // Section 6: Data Safety
    doc.addPage().fontSize(14).text("📊 Data Safety", { underline: true });
    doc.fontSize(12);

    if (ds.securityPractices?.length) {
      doc.text("Security Practices:");
      ds.securityPractices.forEach((p) =>
        doc.text(` - ${p.practice}: ${p.description}`)
      );
    }

    if (ds.collectedData?.length) {
      doc.moveDown().text("Collected Data:");
      ds.collectedData.forEach((d) =>
        doc.text(
          ` - ${d.data} (${d.type}) → Purpose: ${d.purpose} | Optional: ${
            d.optional ? "Yes" : "No"
          }`
        )
      );
    }

    if (ds.sharedData?.length) {
      doc.moveDown().text("Shared Data:");
      ds.sharedData.forEach((d) =>
        doc.text(
          ` - ${d.data} (${d.type}) → Purpose: ${d.purpose} | Optional: ${
            d.optional ? "Yes" : "No"
          }`
        )
      );
    }

    // Section 7: Reviews
    doc.addPage().fontSize(14).text("⭐ Reviews Analysis", { underline: true });
    doc
      .fontSize(12)
      .text(`Total Reviews: ${ps.totalReviews || 0}`)
      .text(`Average Rating: ${ps.score || "N/A"}`)
      .text(`Reviews with >3 Stars: ${ps.reviewMoreThan3 || 0}`)
      .text(`Suspicious Reviews: ${ps.suspiciousReviews?.length || 0}`);
    doc.moveDown();

    if (ps.suspiciousReviews?.length) {
      ps.suspiciousReviews.forEach((r, i) =>
        doc.text(
          `${i + 1}. ${r.userName} (${r.score}⭐, ${formatDate(r.date)}) → ${
            r.text
          }`
        )
      );
    }

    // Section 8: Sandbox
    doc.addPage().fontSize(14).text("🔍 Sandbox Analysis", { underline: true });
    if (report.sandboxResult) {
      Object.entries(report.sandboxResult).forEach(([k, v]) =>
        doc.fontSize(12).text(` - ${k}: ${v}`)
      );
    } else {
      doc.fontSize(12).text("No sandbox results available");
    }

    // Footer
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Generated on: ${new Date().toLocaleString()}`, {
        align: "center",
      });
    doc.text(
      "This report was automatically generated by App Security Scanner",
      {
        align: "center",
      }
    );

    doc.end();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate PDF", details: err.message });
  }
}
