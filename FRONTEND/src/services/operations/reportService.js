import { reportURL } from "../apis.js";
import { apiConnector } from "../apiConnector.js";
const { GET_REPORT, GET_REPORT_PDF } = reportURL;
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

// 68a21d88c4601fdc411552de
// 68a223f2dce4aec8bab9533a
// 68a227e4cdf76f99758f2158
// 68a2ee1f31073d72b395e001