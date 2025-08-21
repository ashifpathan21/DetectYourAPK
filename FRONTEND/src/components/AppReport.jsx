import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const AppReport = ({ report }) => {
  const pieRef = useRef(null);
  const chartInstance = useRef(null);
  const [generatedAt] = useState(new Date().toLocaleString());

  const safe = (s) =>
    s === undefined || s === null || s === "" ? (
      <span className="text-gray-400">N/A</span>
    ) : (
      s
    );

  const renderArrayTable = (arr) =>
    !arr?.length ? (
      <tr>
        <td colSpan="4" className="text-gray-400">
          No data available
        </td>
      </tr>
    ) : (
      arr.map((x, idx) => (
        <tr key={idx}>
          <td>{safe(x.type)}</td>
          <td>{safe(x.data || x.name)}</td>
          <td>{safe(x.purpose)}</td>
          <td>
            {x.optional === 1 ? (
              "Optional"
            ) : x.optional === 0 ? (
              "Required"
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </td>
        </tr>
      ))
    );

  const renderSecurityPractices = (arr) =>
    !arr?.length ? (
      <tr>
        <td colSpan="2" className="text-gray-400">
          No data available
        </td>
      </tr>
    ) : (
      arr.map((x, idx) => (
        <tr key={idx}>
          <td>{safe(x.practice)}</td>
          <td>{safe(x.description)}</td>
        </tr>
      ))
    );

  useEffect(() => {
    const collected = report.datasafety?.collectedData?.length || 0;
    const shared = report.datasafety?.sharedData?.length || 0;
    const totalReviewsSearched = report?.reviewsSearched;
    const reviewsMoreThan3 = report?.reviewsMoreThan3;
    const installs = report?.installs;
    const totalPermissions = report?.totalPermissions;
    const suspiciousPermissions = report?.suspiciousPermissions?.length;

    if (pieRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();

      chartInstance.current = new Chart(pieRef.current, {
        type: "pie",
        data: {
          labels: [
            "Collected data items",
            "Shared data items",
            "Total Searched Reviews",
            "Reviews More Than 3",
            "Installs",
            "Total Permissions",
            "Suspicious Permissions",
          ],
          datasets: [
            {
              data: [
                collected,
                shared,
                totalReviewsSearched,
                reviewsMoreThan3,
                installs,
                totalPermissions,
                suspiciousPermissions,
              ],
              borderWidth: 1,
              backgroundColor: [
                "#46c2ff", // Collected data items (blue)
                "#ff6b6b", // Shared data items (red)
                "#ffd93d", // Total Searched Reviews (yellow)
                "#6bcf63", // Reviews More Than 3 (green)
                "#9b59b6", // Installs (purple)
                "#f39c12", // Total Permissions (orange)
                "#e74c3c", // Suspicious Permissions (dark red)
              ],
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "bottom", labels: { color: "#e8eaf6" } },
            tooltip: { enabled: true },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [report]);

  const riskLevelClass =
    {
      LOW: "bg-green-100",
      MEDIUM: "bg-yellow-100",
      HIGH: "bg-red-100",
    }[report.riskLevel?.toUpperCase()] || "bg-green-100";

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen print:bg-white print:text-black">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-b from-gray-800 to-gray-700 shadow-md hover:brightness-105 print:hidden"
            onClick={() => window.print()}
          >
            🖨️ Print / Save as PDF
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-b from-gray-800 to-gray-700 shadow-md hover:brightness-105 print:hidden"
            onClick={scrollTop}
          >
            ⬆️ Back to Top
          </button>
        </div>
        <div className="text-gray-400">{generatedAt}</div>
      </div>

      {/* Header */}
      <div className="flex gap-4 items-center bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md mb-4 print:bg-gray-100 print:border-gray-300">
        <img
          src={report?.icon}
          alt="App icon"
          className="w-20 h-20 rounded-lg object-cover border border-gray-700"
        />
        <div>
          <h1 className="text-2xl font-bold">{report.appName}</h1>
          <div className="text-gray-400 text-sm mt-1">
            <span className="px-2 py-1 border rounded-full bg-gray-700">
              {report.appId}
            </span>
            &nbsp;•&nbsp; <span className="text-gray-400">Category:</span>{" "}
            {report.categories?.map((c) => c.name).join(", ") || "N/A"}{" "}
            &nbsp;•&nbsp; <span className="text-gray-400">Android:</span>{" "}
            {report.androidVersion || "N/A"}
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-7 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md print:bg-gray-100 print:border-gray-300">
          <h3 className="font-semibold mb-2">ℹ️ App Information</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <th>App Name</th>
                <td>{safe(report.appName)}</td>
              </tr>
              <tr>
                <th>Package ID</th>
                <td>{safe(report.appId)}</td>
              </tr>
              <tr>
                <th>Categories</th>
                <td>
                  {safe(report.categories?.map((c) => c.name).join(", "))}
                </td>
              </tr>
              <tr>
                <th>Android Version</th>
                <td>{safe(report.androidVersion)}</td>
              </tr>
              <tr>
                <th>Play Store</th>
                <td>
                  {report.url ? (
                    <a
                      href={report.url}
                      className="text-blue-400 hover:underline"
                    >
                      {report.url}
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
              <tr>
                <th>Total Permissions</th>
                <td>{safe(report.totalPermissions)}</td>
              </tr>
              <tr>
                <th>Suspicious Permissions</th>
                <td>
                  {report.suspiciousPermissions?.length
                    ? report.suspiciousPermissions.join(", ")
                    : "None"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="md:col-span-5 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md print:bg-gray-100 print:border-gray-300">
          <h3 className="font-semibold mb-2">🚨 Risk Summary</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className={`${riskLevelClass}`}>
                <th>Risk Level</th>
                <td>{report.riskLevel?.toUpperCase() || "LOW"}</td>
              </tr>
              <tr>
                <th>Risk Score</th>
                <td>{report.riskScore ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Summary</th>
                <td>{report.riskSummary ?? "No summary provided."}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Safety Accordion */}
      <details className="mb-4 bg-gray-800 border border-gray-700 rounded-xl shadow-md p-2 print:bg-gray-100 print:border-gray-300">
        <summary className="cursor-pointer font-semibold px-2 py-1">
          🛡️ Data Safety
        </summary>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-xl shadow-md print:bg-gray-100">
            <h4 className="font-semibold mb-2">📥 Collected Data</h4>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Data</th>
                  <th>Purpose</th>
                  <th>Optional</th>
                </tr>
              </thead>
              <tbody>
                {renderArrayTable(report.datasafety?.collectedData)}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-md print:bg-gray-100">
            <h4 className="font-semibold mb-2">🔁 Shared Data</h4>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Data</th>
                  <th>Purpose</th>
                  <th>Optional</th>
                </tr>
              </thead>
              <tbody>{renderArrayTable(report.datasafety?.sharedData)}</tbody>
            </table>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl shadow-md col-span-1 md:col-span-2 print:bg-gray-100">
            <h4 className="font-semibold mb-2">🔐 Security Practices</h4>
            <table className="w-full text-sm">
              <tbody>
                {renderSecurityPractices(report.datasafety?.securityPractices)}
              </tbody>
            </table>
          </div>
        </div>
      </details>

      {/* Pie Chart */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md mb-4 print:bg-gray-100 print:border-gray-300">
        <h4 className="font-semibold mb-2">📊 Data Composition</h4>
        <div className="flex flex-col gap-4 items-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 md:mb-0 w-full">
            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400">Collected items</div>
              <div className="font-bold text-lg">
                {report?.datasafety?.collectedData?.length || 0}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400">Shared items</div>
              <div className="font-bold text-lg">
                {report?.datasafety?.sharedData?.length || 0}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400">Total reviews</div>
              <div className="font-bold text-lg">
                {report?.totalReviews || 0}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400">Total reviews analysed</div>
              <div className="font-bold text-lg">
                {report?.reviewsSearched || 0}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400">Reviews More Than 3</div>
              <div className="font-bold text-lg">
                {report?.reviewsMoreThan3 || 0}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400">Installs</div>
              <div className="font-bold text-lg">{report?.installs || 0}</div>
            </div>
            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400">Total Permissions</div>
              <div className="font-bold text-lg">
                {report?.totalPermissions || 0}
              </div>
            </div>
            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400">Suspicious Permissions</div>
              <div className="font-bold text-lg">
                {report?.suspiciousPermissions?.length || 0}
              </div>
            </div>
          </div>
          <canvas ref={pieRef} className="max-w-md w-full h-64"></canvas>
        </div>
      </div>
    </div>
  );
};

export default AppReport;
