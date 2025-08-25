import axios from "axios";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ML_SERVICE_URL = "https://ml-2hgq.onrender.com/analyze";
const PYTHON_BIN = process.env.PYTHON_BIN || "python";
const SCRIPT_PATH = path.resolve(__dirname, "..", "python", "apk_checker.py");

export async function runApkML(apkPath) {
  // First try the remote service
  try {
    const apkBuffer = await fs.promises.readFile(apkPath);
    const formData = new FormData();
    const blob = new Blob([apkBuffer], {
      type: "application/vnd.android.package-archive",
    });
    formData.append("file", blob, path.basename(apkPath));

    const response = await axios.post(ML_SERVICE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.warn(
      "Remote analysis failed, falling back to local analysis:",
      error.message
    );

    // Fall back to local Python execution
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(apkPath)) {
          return reject(new Error("APK file not found for ML"));
        }
        if (!fs.existsSync(SCRIPT_PATH)) {
          return reject(new Error("apk_checker.py not found"));
        }

        const args = [SCRIPT_PATH, apkPath];
        const py = spawn(PYTHON_BIN, args, {
          stdio: ["ignore", "pipe", "pipe"],
        });

        let out = "";
        let err = "";

        py.stdout.on("data", (d) => (out += d.toString()));
        py.stderr.on("data", (d) => {
          const msg = d.toString();
          err += msg;
        });

        py.on("close", (code) => {
          if (code !== 0 && !out) {
            return reject(new Error(`Python exited with code ${code}: ${err}`));
          }
          try {
            const json = JSON.parse(out.trim());
            resolve(json);
          } catch (e) {
            reject(
              new Error(
                `Failed to parse Python JSON: ${e}\nSTDOUT: ${out}\nSTDERR: ${err}`
              )
            );
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
