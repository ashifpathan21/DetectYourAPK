import { apkURL } from "../apis.js";
import { apiConnector } from "../apiConnector.js";
import { setUserHistory } from "../../Slices/pagesSlice.js";
const { ANALYZE } = apkURL;

export const analyse = async (apk, clientId, userSearches) => {
  const formData = new FormData();
  formData.append("apk", apk);
  try {
    const res = await apiConnector(
      "POST",
      ANALYZE,
       formData,
      {
        "Content-Type": "multipart/form-data",
        "Authorization":`Bearer ${clientId}` ,
      }
    );
    console.log("Upload success:", res.data);
    const payload = res.data;
    setUserHistory(payload);
    console.log("User Searches ==> ", userSearches);
    localStorage.setItem("UserSearches", userSearches);
    return res.data.report;
  } catch (err) {
    console.error("Upload failed:", err);
  }
};

// "68a5e9ea27ff55dea1d43005"
