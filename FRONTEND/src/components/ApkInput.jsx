import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext.jsx";
import { analyse } from "../services/operations/apkService.js";
import { toast } from "react-hot-toast";
import Tilt from "react-parallax-tilt";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const ApkInput = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const clientId =
    localStorage.getItem("token") ||
    useSelector((state) => state.pages.clientId);
  const { userSearches } = useSelector((state) => state.pages);
  const socket = useContext(SocketContext);
  const [analysing, setAnalysing] = useState(false);
  const [statusInfo, setStatusInfo] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!socket) return;

    // ✅ Emit join event once
    socket.emit("join", { clientId });

    // ✅ Listen apkStatus updates
    const handleStatus = ({ clientId, status }) => {
      setStatusInfo(status);
    };

    socket.on("apkStatus", handleStatus);

    // 🧹 Cleanup listener jab component unmount ho ya socket change ho
    return () => {
      socket.off("apkStatus", handleStatus);
    };
  }, [socket, clientId]);

  const upload = async () => {
    if (!file) {
      return;
    }
    setStatusInfo("Uploading");
    setAnalysing(true);

    try {
      const responce = await analyse(file, clientId, userSearches);
      navigate(`/report/${responce._id}`);
      toast.success("Success");
    } catch (error) {
      // console.log(error);
      toast.error("Something Went Wrong");
    }
    setStatusInfo("");
    setAnalysing(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      if (uploadedFile.name.endsWith(".apk")) {
        setFile(uploadedFile);
      } else {
        toast.error("Please upload only APK files!");
      }
    }
  };

  const handleChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith(".apk")) {
      setFile(uploadedFile);
    } else {
      toast.error("Please upload only APK files!");
    }
  };

  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.7}
      glareColor="lightblue"
      glarePosition="all"
      glareBorderRadius="20px"
      className="p-1 flex shadow-md shadow-cyan-300  border-gr rounded-xl  flex-col gap-2"
    >
      <div
        className={` perspective-distant -translate-z-10 shadow-md w-11/12 mx-auto mt-10 min-h-50 flex flex-col justify-center items-center border-dashed rounded-lg p-6 text-center transition `}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        {!analysing ? (
          <>
            <input
              type="file"
              accept={[".apk", ".apkm", ".xapk"]}
              id="fileUpload"
              onChange={handleChange}
              className="hidden"
            />

            <label htmlFor="fileUpload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-cyan-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l1.586-1.586a2 2 0 012.828 0L12 14l3.586-3.586a2 2 0 012.828 0L20 12m-8-8v12"
                  />
                </svg>
                <p className="text-gray-200 font-semibold">
                  Drop your APK here or{" "}
                  <span className="text-cyan-500">browse</span>.
                </p>
              </div>
            </label>

            {file && (
              <p className="mt-4 text-green-600 font-semibold">
                File Details: {file.name}
              </p>
            )}
            {file && (
              <button
                onClick={upload}
                className="bg-cyan-500 items-center text-lg font-semibold text-white px-4 py-2 rounded-md mt-5"
              >
                Analyse{" "}
                <i className="text-2xl  ri-search-line text-slate-600"></i>
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
    </Tilt>
  );
};

export default ApkInput;
