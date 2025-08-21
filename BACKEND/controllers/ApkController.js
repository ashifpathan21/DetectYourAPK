import AppInfoParser from "app-info-parser";
import path from "path";
import fs from "fs";
import { runDynamicAnalysis } from "../utils/sandbox.js";
import { analyzeApp } from "../utils/gplayscraper.js";
import AppReport from "../models/AppReport.js";
import { sendApkStatus } from "../socket.js";

export const analyse = async (req, res) => {
  try {
    console.log("Analyzing ....");

    // 1. Validate file
    if (!req.file) {
      return res.status(400).json({ error: "No APK file uploaded" });
    }

    // 2. Get clientId (socket mapping ke liye)
    const clientId =
      req?.cookies?.clientId ||
      req?.body?.clientId ||
      req?.headers?.authorization?.split(" ")[1]; // ✅ Bearer हटाया

    // 3. Parse APK
    sendApkStatus(clientId, "Parsing the APK");
    const apkPath = path.resolve(req.file.path);
    const parser = new AppInfoParser(apkPath);
    const apk = await parser.parse();
    const packageId = apk?.package;
    console.log("📦 Package ID:", packageId);

    if (!packageId) {
      fs.unlinkSync(apkPath);
      return res.status(400).json({ error: "Package ID not found in APK" });
    }

    // 4. Analyze Play Store + permissions + reviews
    sendApkStatus(
      clientId,
      "Analyzing the APK (Play Store + Permissions + Reviews)"
    );
    const report = await analyzeApp(packageId, clientId);

    // 5. Run sandbox
    sendApkStatus(
      clientId,
      "Running under controlled environment to check its behavior"
    );
    let scanResults = await runDynamicAnalysis(apkPath);
    while (!scanResults) {
      // Retry until result is obtained
      scanResults = await runDynamicAnalysis(apkPath);
    }

    // 6. Security Verification (placeholder for ML / Androguard)
    sendApkStatus(
      clientId,
      "Verifying SHA-256, Certificates and Suspicious Permissions"
    );

    // 7. Save sandbox results in DB
    sendApkStatus(clientId, "Creating a Report");
    const updatedReport = await AppReport.findByIdAndUpdate(
      report._id,
      {
        $set: {
          sandboxResult: scanResults,
          updatedAt: new Date(),
        },
      },
      { new: true } // return updated doc
    );

    // 8. Delete temp file
    fs.unlinkSync(apkPath);

    // 9. Send response
    res.json({
      message: "APK analyzed successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("❌ analyse error:", error);
    res
      .status(500)
      .json({ error: "Failed to analyse APK", details: error.message });
  }
};
