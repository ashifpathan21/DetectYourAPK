// routes/report.js
import express from "express";
import AppReport from "../models/AppReport.js";
import { generateAppReportPdf } from "../utils/generateAppReportPdf.js";

const router = express.Router();

// Preview/Download PDF
router.get("/:id", async (req, res) => {
  try {console.log("working")
    const report = await AppReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
   console.log(report)
   return res.json({
    report
   })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Preview/Download PDF
router.get("/pdf/:id", async (req, res) => {
  try {console.log("working")
    const report = await AppReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
   
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${report.appName}_report.pdf"`
    );

    await generateAppReportPdf(report, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
