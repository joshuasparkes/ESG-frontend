import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ userId }) => {
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [newBudget, setNewBudget] = useState(0);
  console.log(userId);

  useEffect(() => {
    // Fetch the user's monthly budget
    const fetchBudget = async () => {
      const db = getFirestore();
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMonthlyBudget(docSnap.data().monthlyBudget);
      } else {
        // Handle the case where the document does not exist
      }
    };

    fetchBudget();
  }, [userId]);

  const handleEditClick = () => {
    setEditMode(true);
    setNewBudget(monthlyBudget);
  };

  const handleSubmit = async () => {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      monthlyBudget: newBudget,
    });

    setMonthlyBudget(newBudget);
    setEditMode(false);
  };
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
        width: "400px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      <Pie data={data} options={options} plugins={[pieChartPlugin]} />

      {editMode ? (
        <div style={{ marginTop: "20px" }}>
          <input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginRight: "8px",
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              padding: "8px 16px",
              fontSize: "1rem",
              color: "white",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <text style={{ marginRight: "8px", fontSize: "1rem", color: "#333" }}>
            Monthly Budget: £{monthlyBudget}
          </text>
          <button
            onClick={handleEditClick}
            style={{
              padding: "4px 16px",
              fontSize: "1rem",
              color: "white",
              backgroundColor: "grey",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default PieChartComponent;
