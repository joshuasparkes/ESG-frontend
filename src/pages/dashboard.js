import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Card, CardContent } from "@mui/material";
import Navbar from "../components/navBar";
import TreeIcon from "@mui/icons-material/Forest"; // or your preferred icon
import PeopleIcon from "@mui/icons-material/People"; // Icon for Beam box
import FoodBankIcon from '@mui/icons-material/FoodBank';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Dashboard() {
  const [treesPlanted, setTreesPlanted] = useState(0);
  const ecologiUsername = "michelle"; // Replace with the actual username
  const [donationDetails, setDonationDetails] = useState({
    amount: "0.00",
    currencyCode: "GBP",
    donationDate: "",
    donorDisplayName: "",
    message: "",
  });

  useEffect(() => {
    const apiUrl = `https://public.ecologi.com/users/${ecologiUsername}/trees`;

    const fetchTreesPlanted = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTreesPlanted(data.total);
      } catch (error) {
        console.error("Error fetching the number of trees planted:", error);
      }
    };

    fetchTreesPlanted();
  }, [ecologiUsername]);

  useEffect(() => {
    const donationId = "D189693899"; // Replace with your actual donation ID
    const appID = "169c43da";
    const justGivingApiUrl = `https://api.staging.justgiving.com/${appID}/v1/donation/${donationId}`;

    const fetchDonationDetails = async () => {
      try {
        const response = await fetch(justGivingApiUrl, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${btoa("joshsparkes:1Time4UrMind!")}`, // Replace with your JustGiving username and password
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDonationDetails({
          amount: data.amount,
          currencyCode: data.currencyCode,
          donationDate: data.donationDate,
          donorDisplayName: data.donorDisplayName,
          message: data.message,
        });
      } catch (error) {
        console.error("Error fetching donation details:", error);
      }
    };

    fetchDonationDetails();
  }, []);

  const ecologiDashboardBox = (
    <Card sx={{ width: 350, height: 300, margin: 2, textAlign: "center" }}>
      <CardContent>
        <TreeIcon style={{ fontSize: "100px", color: "green" }} />
        <Typography variant="h5" component="div">
          Ecologi
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Trees Planted
        </Typography>
        <Typography variant="h4" component="div" style={{ fontSize: "2rem" }}>
          {treesPlanted.toLocaleString()}
        </Typography>
        <Typography sx={{ mb: 1, fontSize: 12 }} color="text.secondary">
          Developer note: This number is fetched from a random user on Ecologi
          API
        </Typography>
      </CardContent>
    </Card>
  );

  const donationDashboardBox = (
    <Card sx={{ width: 350, height: 300, margin: 2, textAlign: "center" }}>
      <CardContent>
        <PeopleIcon style={{ fontSize: "100px", color: "blue" }} />
        <Typography variant="h5" component="div">
          Donations
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Total Donated
        </Typography>
        <Typography variant="h4" component="div" style={{ fontSize: "2rem" }}>
          {donationDetails.currencyCode} {donationDetails.amount}
          {donationDetails.donationDate}
        </Typography>
        {donationDetails.donorDisplayName && (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Last donation by: {donationDetails.donorDisplayName}
          </Typography>
        )}
        {donationDetails.message && (
          <Typography sx={{ mt: 1 }} color="text.secondary">
            Message: "{donationDetails.message}"
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const FakeCharityBox = (
    <Card sx={{ width: 350, height: 300, margin: 2, textAlign: "center" }}>
      <CardContent>
        <FoodBankIcon style={{ fontSize: "100px", color: "blue" }} />
        <Typography variant="h5" component="div">
          Mock Charity
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Helping People{" "}
        </Typography>
        <Typography variant="h4" component="div" style={{ fontSize: "2rem" }}>
          Add this Cause{" "} <AddCircleOutlineIcon/>
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <Container
        style={{
          flexGrow: 1,
          marginLeft: "305px",
          maxWidth: `calc(100% - 305px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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
          {ecologiDashboardBox}
          {donationDashboardBox}
          {FakeCharityBox}
        </Box>
      </Container>
    </div>
  );
}

export default Dashboard;
