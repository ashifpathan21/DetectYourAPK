import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import SandboxSection from "./SandboxSection.jsx";
import { downloadReport } from "../services/operations/reportService.js";

const AppReport = ({ report, onOpen }) => {
  console.log(report)
  const navigate = useNavigate();
  const chartInstance = useRef(null);
  const [generatedAt] = useState(new Date().toLocaleString());
  const [activeTab, setActiveTab] = useState("overview");

  if (!report) {
    return (
      <div className="flex justify-center items-center flex-col gap-2 h-screen text-2xl font-semibold">
        No Report Exist
        <button
          onClick={() => navigate("/")}
          className="text-teal-500 underline"
        >
          Go Home
        </button>
      </div>
    );
  }

  const safe = (s) =>
    s === undefined || s === null || s === "" ? (
      <span className="text-gray-400">N/A</span>
    ) : (
      s
    );

  const download = async () => {
    await downloadReport(report._id || report.report._id);
  };

  const riskLevelClass =
    {
      LOW: "bg-green-200 text-green-900",
      MEDIUM: "bg-yellow-200 text-yellow-900",
      HIGH: "bg-red-200 text-red-900",
    }[report.riskLevel?.toUpperCase()] || "bg-yellow-200 text-yellow-900";

  // Extract data for easier access
  const ps = report.playstore || {};
  const ds = ps.datasafety || {};
  const apkMeta = report.apkMeta || {};
  const cert = report.certificates?.[0] || {};

  // Tab navigation
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            report={report}
            ps={ps}
            ds={ds}
            apkMeta={apkMeta}
            cert={cert}
          />
        );
      case "permissions":
        return <PermissionsTab report={report} ps={ps} />;
      case "data":
        return <DataSafetyTab ds={ds} />;
      case "reviews":
        return <ReviewsTab ps={ps} />;
      case "technical":
        return <TechnicalTab report={report} apkMeta={apkMeta} cert={cert} />;
      default:
        return (
          <OverviewTab
            report={report}
            ps={ps}
            ds={ds}
            apkMeta={apkMeta}
            cert={cert}
          />
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen print:bg-white print:text-black">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-cyan-600 shadow-md hover:brightness-110 print:hidden"
            onClick={download}
          >
            🖨️ Print / Save as PDF
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-cyan-700 shadow-md hover:brightness-110 print:hidden"
            onClick={() => navigate(-1)}
          >
            ⬅ Back
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-cyan-700 shadow-md hover:brightness-110 print:hidden"
            onClick={onOpen}
          >
            Give Feedback
          </button>
        </div>
        <div className="text-gray-400 text-sm">{generatedAt}</div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md mb-6">
        {ps.icon && (
          <img
            src={ps.icon}
            alt="App icon"
            loading="lazy"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-gray-700"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">{ps.appName}</h1>
          <div className="text-gray-400 mt-1">
            <span className="px-2 py-1 border rounded-full bg-gray-700 text-xs sm:text-sm">
              {ps.appId || report.appId}
            </span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs ${riskLevelClass}`}
            >
              {report.verdict || "Unknown Risk"}
            </span>
          </div>
          <p className="mt-2 text-sm sm:text-base">
            <span className="text-gray-400">Category:</span>{" "}
            {ps.categories?.map((c) => c.name).join(", ") || "N/A"}{" "}
            &nbsp;•&nbsp; <span className="text-gray-400">Android:</span>{" "}
            {ps.androidVersion || "N/A"}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700">
        {["overview", "permissions", "data", "reviews", "technical"].map(
          (tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === tab
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

// Sub-components for each tab
const OverviewTab = ({ report, ps, ds, apkMeta, cert }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!ps) return;

    const dataset = [
      ds.collectedData?.length || 0,
      ds.sharedData?.length || 0,
      ps.suspiciousReviews?.length || 0,
      ps.reviewMoreThan3 || 0,
      parseInt((ps.installs || "0").replace(/\D/g, "")) || 0,
      ps.totalPermissions || 0,
      ps.suspiciousPermissions?.length || 0,
    ];

    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      chartInstance.current = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: [
            "Collected Data",
            "Shared Data",
            "Suspicious Reviews",
            "Reviews > 3 Score",
            "Installs",
            "Total Permissions",
            "Suspicious Permissions",
          ],
          datasets: [
            {
              data: dataset,
              borderWidth: 1,
              backgroundColor: [
                "#46c2ff",
                "#ff6b6b",
                "#ffd93d",
                "#6bcf63",
                "#9b59b6",
                "#f39c12",
                "#e74c3c",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { color: "#e8eaf6" } },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const value = context.raw;
                  const percent = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${value} (${percent}%)`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [ps, ds]);

  return (
    <div className="space-y-6">
      {/* Risk & App Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* App Info */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md overflow-x-auto">
          <h3 className="font-semibold mb-3 text-lg">ℹ️ App Information</h3>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Developer</th>
                <td className="p-2">{ps.developer || "N/A"}</td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Website</th>
                <td className="p-2 break-all">
                  <a
                    href={ps.developerWebsite}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ps.developerWebsite || "N/A"}
                  </a>
                </td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Email</th>
                <td className="p-2 break-all">{ps.developerEmail || "N/A"}</td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Privacy Policy</th>
                <td className="p-2 break-all">
                  <a
                    href={ds.privacyPolicyUrl}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ds.privacyPolicyUrl || "N/A"}
                  </a>
                </td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Installs</th>
                <td className="p-2">{ps.installs || "N/A"}</td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Total Reviews</th>
                <td className="p-2">{ps.totalReviews || 0}</td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Score</th>
                <td className="p-2">{ps.score || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Risk Summary */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md overflow-x-auto">
          <h3 className="font-semibold mb-3 text-lg">🚨 Risk Summary</h3>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="odd:bg-cyan-700 font-semibold">
                <th className="text-left p-2">Verdict</th>
                <td className="p-2">{report.verdict || "N/A"}</td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Risk Score</th>
                <td className="p-2">
                  {report.risk_score
                    ? (report.risk_score * 100).toFixed(2) + "%"
                    : "N/A"}
                </td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Safe Confidence</th>
                <td className="p-2">
                  {report.confidence?.safe
                    ? (report.confidence.safe * 100).toFixed(2) + "%"
                    : "N/A"}
                </td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Fake Confidence</th>
                <td className="p-2">
                  {report.confidence?.fake
                    ? (report.confidence.fake * 100).toFixed(2) + "%"
                    : "N/A"}
                </td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">APK Name</th>
                <td className="p-2 break-all">
                  {ps?.appName || apkMeta.apk_name || "N/A"}
                </td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">SHA256</th>
                <td className="p-2 break-all font-mono text-xs">
                  {apkMeta.sha256 || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sandbox Result */}
      {report.sandboxResult && (
        <SandboxSection sandboxResult={report.sandboxResult} />
      )}

      {/* Data Visualization */}
      <div className="bg-gray-800 border h-90 pb-20 border-gray-700 rounded-xl p-5 shadow-md">
        <h3 className="font-semibold mb-3 text-lg">📊 Data Composition</h3>
        <canvas ref={chartRef} className="w-full h-20" />
      </div>
    </div>
  );
};

const PermissionsTab = ({ report, ps }) => {
  return (
    <div className="space-y-6">
      {/* Dangerous Permissions */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
        <h3 className="font-semibold mb-3 text-lg">⚠️ Dangerous Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {report.permissions?.dangerous?.map((permission, index) => (
            <div key={index} className="bg-red-900/30 p-2 rounded">
              {permission}
            </div>
          ))}
        </div>
      </div>

      {/* All Permissions */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
        <h3 className="font-semibold mb-3 text-lg">🔑 All Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {report.permissions?.all?.length > 0
            ? report.permissions?.all?.map((permission, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    report.permissions.dangerous.includes(permission)
                      ? "bg-red-900/30"
                      : "bg-gray-700/30"
                  }`}
                >
                  {permission}
                </div>
              ))
            : ps?.permissions.map((perm, index) => (
                <div key={index} className=" p-2 rounded">
                  <div className="font-semibold">{perm.permission}</div>
                  <div className="text-sm text-gray-400">{perm.type}</div>
                </div>
              ))}
        </div>
      </div>

      {/* Suspicious Permissions */}
      {ps.suspiciousPermissions?.length > 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold mb-3 text-lg">
            🚨 Suspicious Permissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ps.suspiciousPermissions.map((perm, index) => (
              <div key={index} className="bg-red-900/30 p-2 rounded">
                <div className="font-semibold">{perm.permission}</div>
                <div className="text-sm text-gray-400">{perm.type}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        report?.playstore?.suspiciousPermissions?.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
            <h3 className="font-semibold mb-3 text-lg">
              🚨 Suspicious Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ps.playstore.suspiciousPermissions.map((perm, index) => (
                <div key={index} className="bg-red-900/30 p-2 rounded">
                  <div className="font-semibold">{perm.permission}</div>
                  <div className="text-sm text-gray-400">{perm.type}</div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

const DataSafetyTab = ({ ds }) => {
  return (
    <div className="space-y-6">
      {/* Security Practices */}
      {ds.securityPractices && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold mb-3 text-lg">🔒 Security Practices</h3>
          <div className="space-y-3">
            {ds.securityPractices.map((practice, index) => (
              <div key={index} className="bg-gray-700/30 p-3 rounded">
                <div className="font-semibold">{practice.practice}</div>
                <div
                  className="text-sm text-gray-400"
                  dangerouslySetInnerHTML={{ __html: practice.description }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collected Data */}
      {ds.collectedData && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold mb-3 text-lg">📥 Collected Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 text-left">Data Type</th>
                  <th className="p-2 text-left">Purpose</th>
                  <th className="p-2 text-left">Optional</th>
                </tr>
              </thead>
              <tbody>
                {ds.collectedData.map((data, index) => (
                  <tr key={index} className="odd:bg-gray-700/30">
                    <td className="p-2">
                      <div className="font-semibold">{data.data}</div>
                      <div className="text-xs text-gray-400">{data.type}</div>
                    </td>
                    <td className="p-2">{data.purpose}</td>
                    <td className="p-2">{data.optional ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shared Data */}
      {ds.sharedData && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold mb-3 text-lg">📤 Shared Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 text-left">Data Type</th>
                  <th className="p-2 text-left">Purpose</th>
                  <th className="p-2 text-left">Optional</th>
                </tr>
              </thead>
              <tbody>
                {ds.sharedData.map((data, index) => (
                  <tr key={index} className="odd:bg-gray-700/30">
                    <td className="p-2">
                      <div className="font-semibold">{data.data}</div>
                      <div className="text-xs text-gray-400">{data.type}</div>
                    </td>
                    <td className="p-2">{data.purpose}</td>
                    <td className="p-2">{data.optional ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewsTab = ({ ps }) => {
  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
        <h3 className="font-semibold mb-3 text-lg">⭐ Review Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/30 p-3 rounded text-center">
            <div className="text-2xl font-bold">{ps.score || "N/A"}</div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
          <div className="bg-gray-700/30 p-3 rounded text-center">
            <div className="text-2xl font-bold">{ps.totalReviews || 0}</div>
            <div className="text-sm text-gray-400">Total Reviews</div>
          </div>
          <div className="bg-gray-700/30 p-3 rounded text-center">
            <div className="text-2xl font-bold">{ps.reviewMoreThan3 || 0}</div>
            <div className="text-sm text-gray-400">Reviews &gt; 3 Stars</div>
          </div>
          <div className="bg-gray-700/30 p-3 rounded text-center">
            <div className="text-2xl font-bold">
              {ps.suspiciousReviews?.length || 0}
            </div>
            <div className="text-sm text-gray-400">Suspicious Reviews</div>
          </div>
        </div>
      </div>

      {/* Suspicious Reviews */}
      {ps.suspiciousReviews && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold mb-3 text-lg">⚠️ Suspicious Reviews</h3>
          <div className="space-y-4">
            {ps.suspiciousReviews.map((review, index) => (
              <div key={index} className="bg-red-900/30 p-4 rounded">
                <div className="flex justify-between items-start">
                  <div className="font-semibold">{review.userName}</div>
                  <div className="text-yellow-400">
                    {"★".repeat(review.score)}
                    {"☆".repeat(5 - review.score)}
                  </div>
                </div>
                <div className="mt-2">{review.text}</div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TechnicalTab = ({ report, apkMeta, cert }) => {
  return (
    <div className="space-y-6">
      {/* APK Information */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
        <h3 className="font-semibold mb-3 text-lg">📦 APK Information</h3>
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">APK Name</th>
              <td className="p-2 break-all">{apkMeta.apk_name || "N/A"}</td>
            </tr>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">Package Name</th>
              <td className="p-2 break-all">{apkMeta.package_name || "N/A"}</td>
            </tr>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">Version Name</th>
              <td className="p-2">{apkMeta.version_name || "N/A"}</td>
            </tr>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">Version Code</th>
              <td className="p-2">{apkMeta.version_code || "N/A"}</td>
            </tr>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">Size</th>
              <td className="p-2">
                {apkMeta.size_bytes
                  ? (apkMeta.size_bytes / 1024 / 1024).toFixed(2) + " MB"
                  : "N/A"}
              </td>
            </tr>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">SHA256</th>
              <td className="p-2 break-all font-mono text-xs">
                {apkMeta.sha256 || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Certificate Information */}
      {cert && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
          <h3 className="font-semibold mb-3 text-lg">
            🔐 Certificate Information
          </h3>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Subject</th>
                <td className="p-2 break-all">{cert.subject || "N/A"}</td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Issuer</th>
                <td className="p-2 break-all">{cert.issuer || "N/A"}</td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Serial Number</th>
                <td className="p-2 break-all">{cert.serial_number || "N/A"}</td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Not Before</th>
                <td className="p-2">
                  {cert.not_before
                    ? new Date(cert.not_before).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Not After</th>
                <td className="p-2">
                  {cert.not_after
                    ? new Date(cert.not_after).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
              <tr className="odd:bg-gray-700/40">
                <th className="text-left p-2">Signature Algorithm</th>
                <td className="p-2">{cert.signature_algorithm || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ML Analysis */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md">
        <h3 className="font-semibold mb-3 text-lg">🤖 ML Analysis</h3>
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">Safe Confidence</th>
              <td className="p-2">
                {report.confidence?.safe
                  ? (report.confidence.safe * 100).toFixed(2) + "%"
                  : "N/A"}
              </td>
            </tr>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">Fake Confidence</th>
              <td className="p-2">
                {report.confidence?.fake
                  ? (report.confidence.fake * 100).toFixed(2) + "%"
                  : "N/A"}
              </td>
            </tr>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">Risk Score</th>
              <td className="p-2">
                {report.risk_score
                  ? (report.risk_score * 100).toFixed(2) + "%"
                  : "N/A"}
              </td>
            </tr>
            <tr className="odd:bg-gray-700/40">
              <th className="text-left p-2">Verdict</th>
              <td className="p-2">{report.verdict || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppReport;
