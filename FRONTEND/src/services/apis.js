const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apkURL = {
  ANALYZE: BASE_URL + "apk/analyze",
};

export const linkURL = {
  ANALYZE: BASE_URL + "link/analyze",
};

export const feedbackURL = {
  ADD: BASE_URL + "feedback/add",
  GET: BASE_URL + "feedback/get",
};

export const reportURL = {
  GET_REPORT : BASE_URL + "report",
  GET_REPORT_PDF : BASE_URL + "report/pdf",
}
