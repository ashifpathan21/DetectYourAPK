import React, { useState, useEffect } from "react";
import { getAllReports } from "../services/operations/reportService.js";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import Unknown from "../assets/unknown.jpg";
const Reports = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function get() {
      try {
        const res = await getAllReports();
        setReports(res || []); // fallback
        console.log(res);
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
    get();
  }, []);

  return (
    <div className="min-h-screen w-screen ">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10 p-6  rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6">All Reports</h1>

        {reports.length === 0 ? (
          <p className="text-gray-600">No reports found.</p>
        ) : (
          <>
            {/* ✅ Mobile (list view) */}
            <div className="space-y-4 md:hidden">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-4 border border-cyan-400 rounded-lg shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={report?.playstore?.icon || report?.icon || Unknown}
                      alt={report.appName || "App"}
                      className="w-12 h-12 rounded-md object-cover border"
                    />
                    <div>
                      <p className="font-semibold">
                        {report.appName ||
                          report?.playstore?.appName ||
                          "Unknown App"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {report.appId || report?.playstore?.appId || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <button
                      onClick={() => navigate(`/report/${report._id}`)}
                      className="bg-cyan-600 text-white px-3 py-1.5 rounded-md hover:bg-cyan-700 transition text-sm"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Desktop (table view) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="">
                  <tr>
                    <th className="text-left p-3">App</th>
                    <th className="text-left p-3">Package</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-center p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report._id}
                      className="border-t hover:bg-cyan-300 mt-2 border-cyan-900  transition-all duration-500"
                    >
                      {/* ✅ App Icon + Name */}
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={
                            report?.playstore?.icon || report?.icon || Unknown
                          }
                          alt={report.appName || "App"}
                          className="w-10 h-10 rounded-md object-cover border"
                        />
                        <span className="font-medium">
                          {report.appName ||
                            report?.playstore?.appName ||
                            "Unknown App"}
                        </span>
                      </td>

                      {/* ✅ Package Name */}
                      <td className="p-3 text-gray-600">
                        {report.appId || report?.playstore?.appId || "N/A"}
                      </td>

                      {/* ✅ Date */}
                      <td className="p-3 text-gray-600">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* ✅ View Report Button */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => navigate(`/report/${report._id}`)}
                          className="bg-emerald-400 text-white px-6 py-3 rounded-md hover:bg-emerald-300 transition-all hover:font-semibold  duration-500"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
