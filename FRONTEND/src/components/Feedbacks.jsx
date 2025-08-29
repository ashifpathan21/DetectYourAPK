import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getFeedbacks } from "../services/operations/feedbackService";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFeedbacks();
      setFeedbacks(data || []);
    };
    fetchData();
  }, []);

  if (!feedbacks || feedbacks.length === 0) return null;

  return (
    <div className="w-full  py-12 overflow-hidden">
        <h1 className='text-3xl font-semibold p-2 mb-4 text-center'>Our Feedbacks </h1>
      <motion.div
        className="flex space-x-6 "
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: feedbacks.length * 3,
            ease: "linear",
          },
        }}
      >
        {/* Duplicate the array to make infinite loop smooth */}
        {[...feedbacks, ...feedbacks].map((f, idx) => (
          <motion.div
            key={idx + "_" + f._id}
            className="min-w-[250px] max-w-xs backdrop-blur-3xl p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-150 shadow-cyan-400/50 text-white flex flex-col h-fit"
          >
            <p className="text-xl mb-2 font-semibold">
              {"⭐".repeat(f.rating)}{" "}
             
            </p>
            <p className="text-gray-300">{f.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Feedbacks;
