import { reportURL } from "../apis.js";
import { apiConnector } from "../apiConnector.js";
const { GET_REPORT, GET_REPORT_PDF , GET_ALL_REPORTS } = reportURL;
import { toast } from "react-hot-toast";

export const getReport = async (reportId) => {
  const toastId = toast.loading("Getting Report");
  try {
    const response = await apiConnector("GET", `${GET_REPORT}/${reportId}`);
    toast.dismiss(toastId);
    return response.data.report;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Invalid Report Id");
  }
};
export const getAllReports = async () => {
  const toastId = toast.loading("Getting Report");
  try {
    const response = await apiConnector("GET", GET_ALL_REPORTS);
    toast.dismiss(toastId);
    return response.data.reports;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Invalid Report Id");
  }
};

export const downloadReport = async (reportId) => {
    const url = `${GET_REPORT_PDF}/${reportId}`;
    window.open(url, "_blank");

};

// 68a21d88c4601fdc411552de
// 68a223f2dce4aec8bab9533a
// 68a227e4cdf76f99758f2158
// 68a2ee1f31073d72b395e001