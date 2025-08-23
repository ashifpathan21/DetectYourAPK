import { analyzeApp } from "../utils/gplayscraper.js";
import AppReport from "../models/AppReport.js";

export const analyse = async (req, res) => {
  try {
    
    console.log("Analyzing from Play Store link / packageId ....");

    const { apkUrl } = req.body;
    if (!apkUrl) {
      return res.status(400).json({ error: "No packageId or URL provided" });
    }

    // 🔹 Get clientId
    const clientId =
      req?.cookies?.clientId ||
      req?.body?.clientId ||
      req?.headers?.authorization?.split(" ")[1]; // ✅ Bearer हटाया

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

    // 1. Check if report exists 
    let existReport = await AppReport.findOne({ appId: packageId });
    if (existReport) {
      existReport = await AppReport.findByIdAndUpdate(
        existReport._id,
        { $addToSet: { userSearched: clientId } },
        { new: true }
      );
      return res.json({
        message: "APK analyzed successfully (from cache)",
        report: existReport,
      });
    }

    // 2. Analyze app using scraper (Play Store info, permissions, reviews, etc.)
    const playstoreReport = await analyzeApp(packageId, clientId);
    if (!playstoreReport) {
      return res.status(500).json({ error: "Failed to analyze app" });
    }

   
    // 3. Save into DB (first insert)
    let newReport = await AppReport.create({
      appId:playstoreReport?.appId ,
      playstore:playstoreReport,
      userSearched: clientId ? [clientId] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await analyzeBankingApp(playstoreReport)

    // 4. Return response
    res.json({
      message: "APK analyzed successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("❌ analyse error:", error);
    res
      .status(500)
      .json({ error: "Failed to analyse APK", details: error.message });
  }
};

const analyzeBankingApp = async (playstoreData) => {
  try {
    const {
      appId,
      title,
      developer,
      installs,
      description,
      genre,
      score,
      reviews,
    } = playstoreData;

    let riskScore = 0;
    let reasons = [];

    // ---------- RULE BASED CHECKS ----------
    // 1. Banking related keyword in name/genre
    const bankingKeywords = ["bank", "finance", "upi", "payment", "wallet"];
    if (
      bankingKeywords.some((kw) =>
        (title + " " + genre).toLowerCase().includes(kw)
      )
    ) {
      reasons.push("Banking/finance keywords detected in app name or genre");
      riskScore += 10;
    }

    // 2. Low installs => suspicious
    if (installs < 10000) {
      reasons.push("Low installs for a banking related app");
      riskScore += 20;
    }

    // 3. Low rating => suspicious
    if (score && score < 3.5) {
      reasons.push("Low rating detected (<3.5)");
      riskScore += 15;
    }

    // 4. Developer credibility
    if (
      developer &&
      (developer.toLowerCase().includes("unknown") ||
        developer.toLowerCase().includes("test") ||
        developer.toLowerCase().length < 5)
    ) {
      reasons.push("Developer name looks suspicious");
      riskScore += 20;
    }

    // 5. Reviews analysis (basic heuristic)
    if (reviews && reviews < 50) {
      reasons.push("Very few reviews for a banking-related app");
      riskScore += 15;
    }

    // 6. Description keyword check
    if (description && description.toLowerCase().includes("get rich quick")) {
      reasons.push("Suspicious description with scam-like keywords");
      riskScore += 30;
    }

    // Normalize risk score
    if (riskScore > 100) riskScore = 100;

    // Verdict & confidence
    let verdict = "Safe Banking App";
    let confidence = { safe: 90/100, fake: 10/100 };

    if (riskScore > 60) {
      verdict = "Likely Fake Banking App";
      confidence = { safe: 10/100, fake: 90/100 };
    } else if (riskScore > 30) {
      verdict = "Suspicious - Needs Review";
      confidence = { safe: 50/100, fake: 50/100 };
    }

    // ---------- SAVE/UPDATE in DB ----------
    let report = await AppReport.findOneAndUpdate(
      { appId },
      {
        appId,
        playstore: playstoreData,
        risk_score: riskScore,
        verdict,
        confidence,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return {
      appId,
      appName: title,
      developer,
      installs,
      score,
      reviews,
      genre,
      verdict,
      confidence,
      riskScore,
      reasons,
    };
  } catch (error) {
    console.error("❌ AI Analysis error:", error);
    return { error: "Analysis failed" };
  }
};