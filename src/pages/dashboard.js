import React, { useState, useEffect, useCallback } from "react";
import { Typography, Container, Box, Card, CardContent } from "@mui/material";
import Navbar from "../components/navBar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Tree from "../images/Tree.png";
import PeopleIcon from "@mui/icons-material/People"; // Icon for Beam box
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore instance
import { useAuth } from "../components/authContext";
import PieChartComponent from "../components/pie";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [open, setOpen] = useState(false);
  const [treeCount, setTreeCount] = useState(0);
  const [donationDetails, setDonationDetails] = useState(0);

  // const [donationDetails, setDonationDetails] = useState({
  //   amount: "0.00",
  //   currencyCode: "GBP",
  //   donationDate: "",
  //   donorDisplayName: "",
  //   message: "",
  // });

  const handlePurchaseClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTreeCountChange = (event) => {
    setTreeCount(event.target.value);
  };

  const handlePurchase = async () => {
    if (!currentUser) {
      console.error("No user is signed in.");

      return;
    }

    // Fetch the user's Ecologi API key
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const ecologiKey = userData.ecologiKey;
      if (!ecologiKey) {
        console.error("Ecologi API key is not set for the user.");
        return;
      }

      // Change the URL to your Flask server's endpoint
      const proxyUrl = `http://localhost:5000/purchase-trees`;

      try {
        const response = await fetch(proxyUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ecologiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: parseInt(treeCount, 10), // Change this to "number" to match the API's expected format
            // You can optionally include other fields like "name" or "test" if required
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle the response
        const data = await response.json();
        console.log("Trees purchased successfully:", data);

        // Update UI
        setOpen(false);
        setTreeCount(0);
        fetchTreesPlanted();
      } catch (error) {
        console.error("Error purchasing trees:", error);
      }
    } else {
      console.log("User document does not exist.");
    }
  };

  const fetchTreesPlanted = useCallback(
    async (isSubscribed) => {
      if (!currentUser) {
        console.log("No user is signed in.");
        return;
      }

      // Fetch the user's document to get the Ecologi API key and username
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        updateUserProfile(userData);
        const ecologiKey = userProfile ? userProfile.ecologiKey : null;
        const ecologiUsername = userProfile
          ? userProfile.ecologiUsername
          : null;

        if (!ecologiUsername) {
          console.error("Ecologi API key or username is not set for the user.");
          return;
        }

        if (!ecologiKey) {
          console.error("Ecologi API key or username is not set for the user.");
          return;
        }

        const apiUrl = `https://public.ecologi.com/users/${ecologiUsername}/trees`;

        try {
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${ecologiKey}`,
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (isSubscribed) {
            setTreesPlanted(data.total);
          }
        } catch (error) {
          console.error("Error fetching the number of trees planted:", error);
        }
      } else {
        console.log("User document does not exist.");
      }
    },
    // eslint-disable-next-line
    [currentUser]
  );

  useEffect(() => {
    let isSubscribed = true;

    const fetchUserProfile = async () => {
      if (currentUser && currentUser.uid) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          updateUserProfile(userData);
          if (userData.ecologiKey && userData.ecologiUsername && isSubscribed) {
            fetchTreesPlanted(
              userData.ecologiKey,
              userData.ecologiUsername,
              isSubscribed
            );
          }
        }
      }
    };

    if (currentUser) {
      fetchUserProfile();
    } else {
      navigate("/signIn");
    }

    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line
  }, [currentUser, navigate, fetchTreesPlanted]);

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
    <Card
      elevation={0}
      sx={{
        border: 2,
        borderWidth: 1,
        borderRadius: 8,
        width: 350,
        height: 300,
        margin: 2,
        textAlign: "center",
      }}
    >
      <CardContent>
        <img width={"auto"} height={"100px"} src={Tree} alt="Ecologi" />
        <Typography variant="h5" component="div">
          Ecologi
        </Typography>
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          Trees Planted
        </Typography>
        <Typography variant="h4" component="div" style={{ fontSize: "2rem" }}>
          {treesPlanted.toLocaleString()}
        </Typography>
        {userProfile && userProfile.ecologiKey ? (
          <Button
            variant="contained"
            disableElevation
            style={{
              margin: "10px",
              color: "black",
              borderColor: "black",
              borderWidth: "1px",
              borderStyle: "solid",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
            onClick={handlePurchaseClick}
          >
            Plant More Trees
          </Button>
        ) : (
          <Button
            variant="contained"
            disableElevation
            style={{
              margin: "10px",
              color: "black",
              borderColor: "black",
              borderWidth: "1px",
              borderStyle: "solid",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
            onClick={() => {
              window.location.href = "/integrations";
            }} // Redirect to the integrations page
          >
            Connect to Ecologi
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const donationDashboardBox = (
    <Card
      elevation={0}
      sx={{
        border: 2,
        borderWidth: 1,
        borderRadius: 8,
        width: 350,
        height: 300,
        margin: 2,
        textAlign: "center",
      }}
    >
      <CardContent>
        <PeopleIcon style={{ fontSize: "100px", color: "blue" }} />
        <Typography variant="h5" component="div">
          JustGiving
        </Typography>
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
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

  // const FakeCharityBox = (
  //   <Card
  //     elevation={0}
  //     sx={{
  //       border: 2,
  //       borderWidth: 1,
  //       borderRadius: 8,
  //       width: 350,
  //       height: 300,
  //       margin: 2,
  //       textAlign: "center",
  //     }}
  //   >
  //     <CardContent>
  //       <FoodBankIcon style={{ fontSize: "100px", color: "blue" }} />
  //       <Typography variant="h5" component="div">
  //         Mock Charity
  //       </Typography>
  //       <Typography sx={{ mt: 1.5 }} color="text.secondary">
  //         Helping People{" "}
  //       </Typography>
  //       <Typography variant="h4" component="div" style={{ fontSize: "2rem" }}>
  //         Add this Cause <AddCircleOutlineIcon />
  //       </Typography>
  //     </CardContent>
  //   </Card>
  // );

  const purchaseDialog = (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Purchase Trees</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="treeCount"
          label="Number of Trees"
          type="number"
          fullWidth
          variant="standard"
          value={treeCount}
          onChange={handleTreeCountChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handlePurchase} variant="contained" color="primary">
          Purchase
        </Button>
      </DialogActions>
    </Dialog>
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
          {purchaseDialog}
          {donationDashboardBox}
          <PieChartComponent />
        </Box>
      </Container>
    </div>
  );
}

export default Dashboard;
