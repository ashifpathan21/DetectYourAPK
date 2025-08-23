import React from "react";
import PieChartBox from "./PieChartBox.jsx";

const SandboxSection = ({ sandboxResult }) => {
  if (!sandboxResult) return null;

  return (
    <section className="mb-12 h-full bg-gray-800 p-4 rounded-xl ">
      <h2 className="text-xl font-semibold mb-4">🛡 Sandbox Results</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Written Data */}
        <div className="bg-gray-800 p-4 shadow-md border border-gray-700  rounded-xl space-y-2">
          {Object.entries(sandboxResult).map(([key, val]) => (
            <p key={key}>
              <span className="font-semibold capitalize">{key}:</span> {val}
            </p>
          ))}
        </div>

        {/* Pie Chart */}
        <PieChartBox
          title="Sandbox Breakdown"
          labels={Object.keys(sandboxResult)}
          dataset={Object.values(sandboxResult)}
          colors={[
            "#e74c3c",
            "#f39c12",
            "#3498db",
            "#2ecc71",
            "#9b59b6",
            "#1abc9c",
            "#34495e",
            "#95a5a6",
          ]}
        />
      </div>
    </section>
  );
};

export default SandboxSection;
