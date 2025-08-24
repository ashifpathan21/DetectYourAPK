import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { config } from "dotenv";
config();
const apiKey = process.env.VT_API_KEY; // set your VirusTotal API key

export async function runDynamicAnalysis(apkPath) {
  try {
    // 1️⃣ Prepare form data for upload
    const form = new FormData();
    form.append("file", fs.createReadStream(apkPath));

    // 2️⃣ Upload APK for analysis
    const uploadRes = await axios.post(
      "https://www.virustotal.com/api/v3/files",
      form,
      {
        headers: {
          "x-apikey": apiKey,
          ...form.getHeaders(),
        },
      }
    );

    const analysisId = uploadRes.data.data.id;
    // console.log("Uploaded APK. Analysis ID:", analysisId);

    // 3️⃣ Wait for analysis to complete
    // console.log("Waiting for analysis to complete...");

    let report = null;
    while (true) {
      const res = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: { "x-apikey": apiKey },
        }
      );

      report = res.data.data;

      // Status: queued / in_progress / completed
      if (report.attributes.status === "completed") break;

      // console.log("Analysis not ready yet, waiting 10s...");
      await new Promise((r) => setTimeout(r, 10000));
    }

    // console.log("Analysis completed!");
    // console.log(JSON.stringify(report, null, 2));

    // 4️⃣ Parse relevant info (e.g., malicious / suspicious indicators)
    const stats = report.attributes.stats;
    // console.log("Scan results:", stats);

    return stats;
  } catch (err) {
    // console.error(
    //   "Error running dynamic analysis:",
    //   err.response?.data || err.message
    // );
  }
}

