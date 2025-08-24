import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const PYTHON_BIN = process.env.PYTHON_BIN || "python"; // or "python3"
const SCRIPT_PATH = path.resolve("python/apk_checker.py");

export function runApkML(apkPath) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(apkPath)) {
        return reject(new Error("APK file not found for ML"));
      }
      if (!fs.existsSync(SCRIPT_PATH)) {
        return reject(new Error("apk_checker.py not found"));
      }

      const args = [SCRIPT_PATH, apkPath];
      const py = spawn(PYTHON_BIN, args, { stdio: ["ignore", "pipe", "pipe"] });

      let out = "";
      let err = "";

      py.stdout.on("data", (d) => (out += d.toString()));
      py.stderr.on("data", (d) => {
        const msg = d.toString();
        err += msg;
        // Filter noisy androguard DEBUG lines — don't mark them as errors
        if (/error/i.test(msg)) {
          // console.error("❌ Python Error:", msg);
        } else {
          // optional: // console.log("🐍 Python Log:", msg.trim());
        }
      });

      py.on("close", (code) => {
        if (code !== 0 && !out) {
          return reject(new Error(`Python exited with code ${code}: ${err}`));
        }
        // Python prints only JSON. Parse it.
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
