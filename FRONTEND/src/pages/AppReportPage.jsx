import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getReport } from "../services/operations/reportService.js";
import AppReport from "../components/AppReport.jsx";
import FeedbackInput from "../components/FeedbackInput.jsx";

const AppReportPage = () => {
  const [feedbackModal, setFeedbackModal] = useState(false);

  const onClose = () => setFeedbackModal(false);

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const params = useParams();
  const [reportId, setReportId] = useState(params.id || null);

  const onOpen = () => setFeedbackModal(true);

  useEffect(() => {
    const get = async (reportId) => {
      try {
        console.log("working on getting report");
        const res = await getReport(reportId);
        setReport(res);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(reportId);
    if (reportId) {
      get(reportId);
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        {" "}
        <span className="loader"></span> <h1>Loading...</h1>{" "}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4  min-h-screen">
      {feedbackModal ? (
        <FeedbackInput onClose={onClose} />
      ) : (
        <AppReport onOpen={onOpen} report={report} />
      )}
    </div>
  );
};

export default AppReportPage;
