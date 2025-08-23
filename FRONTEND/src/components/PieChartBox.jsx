// components/PieChartBox.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChartBox = ({ title, labels, dataset, colors }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  

  useEffect(() => {
    if (canvasRef.current) {
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: dataset,
              backgroundColor: colors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom", labels: { color: "#e8eaf6" } },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const value = context.raw;
                  const percent = total
                    ? ((value / total) * 100).toFixed(1)
                    : 0;
                  return `${context.label}: ${value} (${percent}%)`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [labels, dataset, colors]);

  return (
    <div className="bg-gray-800 border h-full  border-gray-700 rounded-xl p-4 shadow-md flex flex-col items-center">
      <h3 className="font-semibold mb-3 text-lg">{title}</h3>
      <div className="h-60 w-60">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default PieChartBox;
