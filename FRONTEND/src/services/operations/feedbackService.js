// services/feedbackService.js
import { feedbackURL } from "../apis"; // your feedback URLs
import { apiConnector } from "../apiConnector";
const { ADD, GET } = feedbackURL;
/**
 * Add feedback to backend
 * @param {number} rating - Rating (1-5)
 * @param {string} text - Feedback text
 * @returns {Promise<object>} response data
 */
export const addFeedback = async (rating, text) => {
  try {
    const response = await apiConnector("POST", ADD, { rating, text });
    // console.log(response)

    return response.data; // { success, message, feedback }
  } catch (error) {
    // console.error("Error adding feedback:", error);
    return { success: false, message: "Internal Server Error" };
  }
};

/**
 * Get all feedbacks from backend
 * @returns {Promise<Array>} array of feedbacks
 */
export const getFeedbacks = async () => {
  try {
    const response = await apiConnector("GET", GET);
    return response.data.feedbacks || [];
  } catch (error) {
    // console.error("Error fetching feedbacks:", error);
    return [];
  }
};
