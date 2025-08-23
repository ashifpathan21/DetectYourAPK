import React, { useState } from "react";
import { addFeedback } from "../services/operations/feedbackService.js";
import { toast } from "react-hot-toast";
const FeedbackInput = ({ onClose }) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null); // For hover effect on stars

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedback.trim() === "" || rating === 0) {
      toast.alert("Please provide feedback and rating!");
      return;
    }
    try {
      await addFeedback(rating, feedback);
      toast.success("Thanks for feedback");
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-3 relative bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <button
          onClick={onClose}
          className="absolute right-2 p-2 font-semibold text-2xl top-2"
        >
          <i className="ri-close-fill"></i>
        </button>
        <h2 className="text-white text-2xl mb-4">Give Your Feedback</h2>

        {/* Star Rating */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <i
              key={starValue}
              className="ri-star-line cursor-pointer transition-colors"
              style={{
                color: starValue <= (hover || rating) ? "#fbbf24" : "#6b7280",
                fontSize: "30px",
              }}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(starValue)}
            />
          ))}
        </div>

        {/* Feedback Textarea */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your feedback here..."
          className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackInput;
