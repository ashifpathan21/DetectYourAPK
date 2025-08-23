import mongoose from "mongoose";

const appReportSchema = new mongoose.Schema(
  {
    appId: { type: String, required: true, unique: true },

    apkMeta: {
      apk_name: String,
      sha256: String,
      size_bytes: Number,
      package_name: String,
      version_name: String,
      version_code: String,
    },

    permissions: {
      all: [String],
      dangerous: [String],
    },

    certificates: [
      {
        subject: String,
        issuer: String,
        serial_number: String,
        not_before: String,
        not_after: String,
        signature_algorithm: String,
        error: String, // अगर cert parse fail हो
      },
    ],

    verdict: { type: String, default: "Unknown" },

    confidence: {
      safe: { type: Number, default: 0 },
      fake: { type: Number, default: 0 },
    },

    risk_score: { type: Number, default: 0 },

    playstore: mongoose.Schema.Types.Mixed, // जो भी analyzeApp से आएगा
    sandboxResult: mongoose.Schema.Types.Mixed, // sandbox का raw JSON

    userSearched: [{ type: String }], // clientIds

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("AppReport", appReportSchema);
