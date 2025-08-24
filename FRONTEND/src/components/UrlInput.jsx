import React, { useState, useContext } from "react";
import { analyse } from "../services/operations/linkService.js";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext.jsx";

const UrlInput = () => {
  const [apkLink, setApkLink] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [statusInfo, setStatusInfo] = useState("");
  const clientId =
    localStorage.getItem("token") ||
    useSelector((state) => state.pages.clientId);
  const { userSearches } = useSelector((state) => state.pages);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!socket) return;
    socket.emit("join", { clientId });

    const handleStatus = ({ clientId, status }) => {
      setStatusInfo(status);
    };
    socket.on("apkStatus", handleStatus);

    return () => {
      socket.off("apkStatus", handleStatus);
    };
  }, [socket, clientId]);

  const handleAnalyse = async () => {
    if (!apkLink.trim()) {
      toast.error("Please enter a valid APK link or ID!");
      return;
    }

    setAnalysing(true);
    setStatusInfo("Analyzing");

    try {
      const response = await analyse(apkLink, clientId, userSearches);
      navigate(`/report/${response._id}`);
      toast.success("Analysis Successful!");
    } catch (error) {
      // console.error(error);
      toast.error("Something went wrong while analyzing link!");
    }

    setAnalysing(false);
    setStatusInfo("");
  };

  return (
    <div className="w-11/12 mx-auto mt-6 flex flex-col items-center gap-3">
      {!analysing ? (
        <>
          <input
            type="text"
            placeholder="Enter Play Store Link (eg.https://play.google.com/store/apps/details?id=com.example.app)"
            value={apkLink}
            onChange={(e) => setApkLink(e.target.value)}
            className="border border-gray-400 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-cyan-500"
          />
          {apkLink && (
            <button
              onClick={handleAnalyse}
              className="bg-cyan-500 text-lg font-semibold text-white px-4 py-2 rounded-md"
            >
              Analyse Link <i className="ri-link text-xl ml-1"></i>
            </button>
          )}
        </>
      ) : (
        <>
          <span className="loader"></span>
          <h1 className="text-xl mt-5 text-cyan-500 font-semibold">
            {statusInfo}
          </h1>
        </>
      )}
    </div>
  );
};

export default UrlInput;
