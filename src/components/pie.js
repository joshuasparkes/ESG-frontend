import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Typography } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = () => {
  const data = {
    labels: [
      "Renewal Energies",
      "Homelessness",
      "Education",
      "Diversity & Inclusion",
    ],
    datasets: [
      {
        data: [10, 30, 50, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Add this to maintain the aspect ratio
  };

  return (
    <div style={{ width: "300px", height: "300px" }}>
      {" "}
      {/* Add a wrapper with specified dimensions */}
      <Typography variant="h4">Your Allocation</Typography>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartComponent;
