import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { doc, getDoc } from "firebase/firestore";
import { Typography } from "@mui/material";
import { db } from "../firebase";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ userId }) => {
  const [monthlyBudget, setMonthlyBudget] = useState(0);

  useEffect(() => {
    let isComponentMounted = true;

    const fetchBudget = async () => {
      if (userId) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isComponentMounted) {
          setMonthlyBudget(docSnap.data().monthlyBudget);
        }
      }
    };

    fetchBudget();

    return () => {
      isComponentMounted = false;
    };
  }, [userId]);

  const data = {
    labels: [
      "Renewable Energies",
      "Homelessness",
      "Education",
      "Diversity & Inclusion",
    ],
    datasets: [
      {
        data: [20, 20, 35, 35],
        backgroundColor: [
          "rgba(120, 120, 120, 0.5)", // Gray
          "rgba(0, 123, 255, 0.5)", // Muted Blue
          "rgba(40, 167, 69, 0.5)", // Muted Green
          "rgba(255, 193, 7, 0.5)", // Muted Yellow
        ],
        borderColor: [
          "rgba(120, 120, 120, 1)", // Gray
          "rgba(120, 120, 120, 1)", // Gray
          "rgba(120, 120, 120, 1)", // Gray
          "rgba(120, 120, 120, 1)", // Gray
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += context.parsed + "%";
            }
            return label;
          },
        },
      },
    },
  };

  // Custom plugin to render labels on pie segments
  const pieChartPlugin = {
    id: "labelsOnPie",
    afterDraw: (chart) => {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, i) => {
        chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
          const { x, y } = datapoint.tooltipPosition();
          const text = `${dataset.data[index]}%`;
          ctx.fillStyle = "black"; // Text color
          ctx.fillText(text, x, y);
        });
      });
    },
  };

  return (
    <div
      style={{
        width: "300px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      <Pie data={data} options={options} plugins={[pieChartPlugin]} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Typography
          style={{
            padding: "8px",
            borderRadius: "4px",
            marginRight: "8px",
          }}
        >
          Monthly Budget: £{monthlyBudget}
        </Typography>
      </div>
    </div>
  );
};

export default PieChartComponent;
