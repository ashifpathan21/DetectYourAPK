import { analyzeApp } from "../utils/gplayscraper.js";
import AppReport from "../models/AppReport.js";

export const analyse = async (req, res) => {
  try {
    console.log("Analyzing from Play Store link / packageId ....");

    const { apkUrl } = req.body;

    if (!apkUrl) {
      return res.status(400).json({ error: "No packageId or URL provided" });
    }

    let packageId = apkUrl;

    // ✅ If it's a Play Store URL, extract package id
    if (apkUrl.includes("play.google.com")) {
      try {
        const urlObj = new URL(apkUrl);
        packageId = urlObj.searchParams.get("id");
        if (!packageId) {
          return res.status(400).json({ error: "Invalid Play Store URL" });
        }
      } catch (err) {
        return res.status(400).json({ error: "Invalid URL format" });
      }
    }

    console.log("📦 Package ID to analyze:", packageId);

    // 1. Analyze app using scraper (Play Store info, permissions, reviews, etc.)
    const report = await analyzeApp(packageId);

    // 2. (Optional) ML / risk analysis placeholder
    // e.g., run risk scoring, suspicious permission analysis, etc.

    // 3. Return response
    res.json({
      message: "APK analyzed successfully",
      report,
    });
  } catch (error) {
    console.error("❌ analyse error:", error);
    res
      .status(500)
      .json({ error: "Failed to analyse APK", details: error.message });
  }
};
