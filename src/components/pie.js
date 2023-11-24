import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  doc,
  getDoc,
  collection,
  where,
  getDocs,
  query,
} from "firebase/firestore";
// import { Typography } from "@mui/material";
import { db } from "../firebase";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ userId }) => {
  // eslint-disable-next-line
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [donationsData, setDonationsData] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      if (userId) {
        const donationsRef = collection(db, "donations");
        const q = query(donationsRef, where("donatingUser", "==", userId));
        const donationsSnapshot = await getDocs(q);

        let groupedDonations = {};
        let totalDonated = 0;

        for (const docSnapshot of donationsSnapshot.docs) {
          const donation = docSnapshot.data();
          const fundRef = doc(db, "funds", donation.linkedFund);
          const fundSnap = await getDoc(fundRef);

          if (fundSnap.exists()) {
            const fund = fundSnap.data();
            const objective = fund.objective;
            groupedDonations[objective] =
              (groupedDonations[objective] || 0) + donation.amount;
            totalDonated += donation.amount;
          }
        }

        // Convert amounts to percentages
        const donationsPercentages = Object.entries(groupedDonations).map(
          ([objective, amount]) => {
            return { objective, percentage: (amount / totalDonated) * 100 };
          }
        );

        setDonationsData(donationsPercentages);
      }
    };

    fetchDonations();
  }, [userId]);

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
    labels: donationsData.map((donation) => donation.objective),
    datasets: [
      {
        data: donationsData.map((donation) => donation.percentage),
        backgroundColor: ["#1E88E5", "#26A69A", "#8E24AA"],
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
          const percentage = dataset.data[index].toFixed(2); // Round to two decimal points
          const text = `${percentage}%`; // Use rounded percentage
          ctx.fillStyle = "black"; // Text color
          ctx.fillText(text, x, y);
        });
      });
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      <Pie data={data} options={options} plugins={[pieChartPlugin]} />
      {/* <div
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
      </div> */}
    </div>
  );
};

export default PieChartComponent;
