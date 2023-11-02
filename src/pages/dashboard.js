import React from "react";
import { Typography, Container, Box } from "@mui/material";
import Navbar from "../components/navBar";
// import { Link } from "react-router-dom"; // Import Link and Route
// import { auth } from "../firebase";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import DashboardBoxes from "../components/dashboardBox"; // Make sure to adjust the import path to where you put the component

function Dashboard() {

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {" "}
      {/* This ensures that the navbar and container take full height */}
      <Navbar />
      <Container
        style={{
          flexGrow: 1, // This allows the container to fill the space
          marginLeft: "305px",
          maxWidth: `calc(100% - 305px)`,
          display: "flex",
          flexDirection: "column", // Stack children vertically
          justifyContent: "space-between", // Space between the text and the boxes
        }}
      >
        <Box>
          <Typography
            variant="h1"
            style={{ fontSize: "48px", marginTop: "30px", color: "#6D7580" }}
          >
            Active Causes
          </Typography>
          <Typography
            variant="h2"
            style={{ fontSize: "24px", color: "#858C94" }}
          >
            Your Commitment to Action
          </Typography>
        </Box>
        <Box style={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          {" "}
          <DashboardBoxes />
        </Box>
      </Container>
    </div>
  );
}

export default Dashboard;
