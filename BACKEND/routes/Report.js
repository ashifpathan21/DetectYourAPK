// routes/report.js
import express from "express";
import AppReport from "../models/AppReport.js";
import { generateAppReportPdf } from "../utils/generateAppReportPdf.js";

const router = express.Router();

// all reports
router.get("/all", async (req, res) => {
  try {
    const reports = await AppReport.find().lean(); // 👈 lean()
    return res.status(200).json({ reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// pdf report (must be above :id)
router.get("/pdf/:id", async (req, res) => {
  try {
    console.log("📄 Generating PDF...");
    const report = await AppReport.findById(req.params.id).lean(); // 👈 lean()
    if (!report) return res.status(404).json({ message: "Report not found" });

    // routes/report.js
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${report.appName || "app"}_report.pdf"`
    );
    

    await generateAppReportPdf(report, res);
  } catch (err) {
    console.error("PDF Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// json report
router.get("/:id", async (req, res) => {
  try {
    const report = await AppReport.findById(req.params.id).lean(); // 👈 lean()
    if (!report) return res.status(404).json({ message: "Report not found" });
    return res.json({ report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
