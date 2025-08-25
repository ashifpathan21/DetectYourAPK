import AppInfoParser from "app-info-parser";
import path from "path";
import fs from "fs";
import { runDynamicAnalysis } from "../utils/sandbox.js";
import { analyzeApp } from "../utils/gplayscraper.js";
import AppReport from "../models/AppReport.js";
import { sendApkStatus } from "../socket.js";
import { runApkML } from "../utils/pythonRunner.js";

export const analyse = async (req, res) => {
  try {
     console.log("Analyzing ....");

    // 1. Validate file
    if (!req.file) {
      return res.status(400).json({ error: "No APK file uploaded" });
    }

    // 2. ClientId
    const clientId =
      req?.cookies?.clientId ||
      req?.body?.clientId ||
      req?.headers?.authorization?.split(" ")[1];

    // 3. Parse APK
  
    sendApkStatus(clientId, "Parsing the APK");
    const apkPath = path.resolve(req.file.path);
    const parser = new AppInfoParser(apkPath);
    const apk = await parser.parse();
    // console.log(apk , apk?.icon)
    const packageId = apk?.package;

    if (!packageId) {
      fs.unlinkSync(apkPath);
      return res.status(400).json({ error: "Package ID not found in APK" });
    }

    // 4. Playstore Analysis
    sendApkStatus(
      clientId,
      "Analyzing the APK (Play Store + Permissions + Reviews)"
    );
    const playstoreReport = await analyzeApp(packageId, clientId);

    // 5. Sandbox Analysis
    sendApkStatus(
      clientId,
      "Running under controlled environment to check its behavior"
    );
    let sandboxResult =  await runDynamicAnalysis(apkPath);
    while (!sandboxResult) {
      sandboxResult = await runDynamicAnalysis(apkPath);
    }

    // 6. ML / Androguard Analysis
    sendApkStatus(
      clientId,
      "Verifying SHA-256, Certificates and Suspicious Permissions"
    );
    const mlReport = await runApkML(apkPath);

    // 7. Prepare final object
    const toSave = {
      appId: packageId,
      apkMeta: {
        apk_name: mlReport?.apk_name,
        sha256: mlReport?.sha256,
        size_bytes: mlReport?.size_bytes,
        package_name: mlReport?.package_name,
        version_name: mlReport?.version_name,
        version_code: mlReport?.version_code,
      },
      permissions: {
        all: mlReport?.permissions || [],
        dangerous: mlReport?.dangerous_permissions || [],
      },
      certificates: mlReport?.certificates || [],
      verdict: mlReport?.verdict || "Unknown",
      confidence: mlReport?.confidence || { safe: 0, fake: 0 },
      risk_score: mlReport?.risk_score ?? 0,
      playstore: playstoreReport || undefined,
      sandboxResult: sandboxResult || undefined,
      updatedAt: new Date(),
      $addToSet: clientId ? { userSearched: clientId } : undefined,
    };

    // 8. Save or Update
    let report = await AppReport.findOneAndUpdate(
      { appId: packageId },
      { $set: toSave, $addToSet: { userSearched: clientId } },
      { new: true, upsert: true }
    );

    // 9. Cleanup temp file
    fs.unlinkSync(apkPath);

    // 10. Send response
    res.json({
      message: "APK analyzed successfully",
      report,
    });
  } catch (error) {
    // console.error("❌ analyse error:", error);
    res
      .status(500)
      .json({ error: "Failed to analyse APK", details: error.message });
  }
};
