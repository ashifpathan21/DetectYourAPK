import mongoose from "mongoose";

// models/AppReport.js
const AppReportSchema = new mongoose.Schema({
  appId: { type: String, required: true }, // package name
  appName: { type: String },
  androidVersion: { type: String },

  categories: [{}],

  // Developer Info
  developer: { type: String },
  developerId: { type: String },
  developerInternalID: { type: String },
  developerEmail: { type: String },
  developerWebsite: { type: String },
  developerLegalName: { type: String },
  developerLegalAddress: { type: String },
  developerLegalEmail: { type: String },
  developerLegalPhoneNumber: { type: String },

  // Store / Play Store Info
  icon: { type: String },
  url: { type: String },
  installs: { type: String },
  totalReviews: { type: Number },
  released: { type: Date },
  score: { type: Number }, // average rating
  privacyPolicyUrl: { type: String },

  // Data Safety Section
  datasafety: {
    type: Object,
  },

  // Reviews Analysis
  reviewsSearched: { type: Number },
  reviewMoreThan3: { type: Number },
  suspiciousReviews: [
    {
      userName: { type: String },
      text: { type: String },
      score: { type: Number },
      date: { type: Date },
    },
  ],

  // Security / Verification
  sha256: { type: String }, // ML or Androguard generated
  certificates: { type: Array }, // app signing info
  verified: { type: Boolean, default: null }, // null if no link
  sandboxResult: { type: Object }, // dynamic analysis result

  // Permissions
  totalPermissions: { type: Number },
  permissions: [
    {
      permission: { type: String },
      type: { type: String },
    },
  ],
  suspiciousPermissions: [
    {
      permission: { type: String },
      type: { type: String },
    },
  ],

  // ML Risk Analysis
  riskScore: { type: Number, min: 0, max: 1 }, // random forest probability
  riskLevel: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    default: "LOW",
  },
  riskSummary: { type: String }, // human-readable summary

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("AppReport", AppReportSchema);
