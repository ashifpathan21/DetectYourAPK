import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const ML_SERVICE_URL = "https://ml-2hgq.onrender.com/analyze";

export async function runApkML(apkPath) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(apkPath));

    const response = await axios.post(ML_SERVICE_URL, formData, {
      headers: { ...formData.getHeaders() },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000, // 2 minutes
    });

    return response.data;
  } catch (error) {
    console.error("Remote analysis failed:", error.message);
    throw error;
  }
}
