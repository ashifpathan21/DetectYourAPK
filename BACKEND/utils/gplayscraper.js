import gplay from "google-play-scraper";
import AppReport from "../models/AppReport.js"; // adjust path
import { sendApkStatus } from "../socket.js";

export async function analyzeApp(packageId, clientId) {
  try {
    // 🔹 Fetch app details
    sendApkStatus(clientId, "Getting App in Play Store");
    const app = await gplay.app({ appId: packageId });

    // 🔹 Collect reviews
    sendApkStatus(clientId, "Collecting Reviews of the App");
    const reviews = await gplay.reviews({
      appId: packageId,
      sort: gplay.sort.NEWEST,
      num: 5000,
    });

    // Reviews filters
    sendApkStatus(clientId, "Analysing the Reviews");
    const reviewMoreThan3 = reviews.data.filter((r) => r.score >= 3);

    // Detect reviews with suspicious keywords
    const suspiciousKeywords =
      /\b(fraud|scam|spam|fake|hack|malware|virus|cheat)\b/i;
    const suspiciousReviews = reviews.data.filter((r) =>
      suspiciousKeywords.test(r.text)
    );

    // 🔹 Permissions
    sendApkStatus(clientId, "Getting the Permissions");
    const permissions = await gplay.permissions({ appId: packageId });

    // Detect suspicious permissions
    sendApkStatus(clientId, "Detecting Suspicious Permissions");

    const suspiciousPermPatterns =
      /sms|call|contacts|camera|microphone|location|storage|record_audio/i;
    const suspiciousPermissions = permissions.filter((p) =>
      suspiciousPermPatterns.test(p.permission)
    );

    // 🔹 Data safety
    sendApkStatus(clientId, "Getting Data Safety");

    const datasafety = await gplay.datasafety({ appId: packageId });

    // 🔹 Map to DB schema
    const report = {
      appId: app.appId,
      appName: app.title,
      androidVersion: app.androidVersion,
      categories: app.categories || [],

      // Developer Info
      developer: app.developer,
      developerId: app.developerId,
      developerInternalID: app.developerId,
      developerEmail: app.developerEmail,
      developerWebsite: app.developerWebsite,
      developerLegalName: app.developerLegalName,
      developerLegalAddress: app.developerAddress,
      developerLegalEmail: app.developerEmail,
      developerLegalPhoneNumber: app?.developerLegalPhoneNumber || null,

      // Store Info
      icon: app.icon,
      url: app.url,
      installs: app.installs,
      totalReviews: app.ratings,
      released: app.released,
      score: app.score,
      privacyPolicyUrl: app.privacyPolicy,

      // Data Safety
      datasafety: datasafety,

      // Reviews
      reviewsSearched: reviews.data.length,
      reviewMoreThan3: reviewMoreThan3.length,
      suspiciousReviews: suspiciousReviews.map((r) => ({
        userName: r.userName,
        text: r.text,
        score: r.score,
        date: r.date,
      })),

      // Permissions
      totalPermissions: permissions.length,
      permissions: permissions, // full list
      suspiciousPermissions: suspiciousPermissions.map((p) => ({
        permission: p.permission,
        type: p.type || "Unknown",
      })),

      // Security / Verification placeholders
      sha256: null,
      certificates: [],
      verified: null,
      sandboxResult: {},

      // ML Risk Analysis placeholders
      riskScore: null,
      riskLevel: "LOW",
      riskSummary: null,
    };

    // 🔹 Save directly in DB
    const savedReport = await AppReport.create(report);

    return savedReport;
  } catch (err) {
    console.error("❌ analyzeApp error:", err.message);
    throw new Error("Failed to analyze app: " + err.message);
  }
}
