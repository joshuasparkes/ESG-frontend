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
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import Tree from "../images/Tree.png";
import JustGiving from "../images/JustGiving.jpg";
import Crisis from "../images/crisis.jpeg";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore instance
import { useAuth } from "../components/authContext";
import PieChartComponent from "../components/pie";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [open, setOpen] = useState(false);
  const [treeCount, setTreeCount] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, set the user ID
        setUserId(user.uid);
      } else {
        // User is signed out
        // Handle the signed-out state as appropriate
      }
    });
  }, []);

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

  // useEffect(() => {
    // const donationId = "D189693899"; // Replace with your actual donation ID
    // const appID = "169c43da";
    // const justGivingApiUrl = `https://api.staging.justgiving.com/${appID}/v1/donation/${donationId}`;

  //   const fetchDonationDetails = async () => {
  //     try {
  //       const response = await fetch(justGivingApiUrl, {
  //         method: "GET",
  //         headers: {
  //           "Content-type": "application/json",
  //           Accept: "application/json",
  //           Authorization: `Basic ${btoa("joshsparkes:1Time4UrMind!")}`, // Replace with your JustGiving username and password
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       // const data = await response.json();
  //       // setDonationDetails({
  //       //   amount: data.amount,
  //       //   currencyCode: data.currencyCode,
  //       //   donationDate: data.donationDate,
  //       //   donorDisplayName: data.donorDisplayName,
  //       //   message: data.message,
  //       // });
  //     } catch (error) {
  //       console.error("Error fetching donation details:", error);
  //     }
  //   };

  //   fetchDonationDetails();
  // }, []);

  const ecologiDashboardBox = (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: 1,
        borderRadius: 3,
        width: "85%",
        borderColor: "darkgray",
        height: 130,
        margin: 0,
        padding: "20px",
      }}
    >
      <img
        width={"100"}
        height={"auto"}
        src={Tree}
        alt="Ecologi"
        style={{ marginRight: "16px" }}
      />
      <CardContent style={{ flexGrow: 1, textAlign: "left" }}>
        <Typography variant="h5" component="div">
          Ecologi
        </Typography>
        <Typography variant="body" component="div">
          Renewable Energy
        </Typography>
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          Monthly Allocation: £2,000
        </Typography>
      </CardContent>
      <div style={{ textAlign: "right" }}>
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          Trees Planted
        </Typography>
        <Typography variant="h4" component="div" style={{ fontSize: "2rem" }}>
          {treesPlanted.toLocaleString()}
        </Typography>
        <Button
          variant="contained"
          disableElevation
          style={{
            color: "black",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            backgroundColor: "white",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          onClick={handlePurchaseClick}
        >
          Plant More Trees
        </Button>
      </div>
    </Card>
  );

  const donationDashboardBox = (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: 1,
        borderColor: "darkgray",
        borderRadius: 3,
        width: "85%",
        height: 130,
        margin: 1,
        padding: "20px",
      }}
    >
      <img
        width={"100"}
        height={"auto"}
        src={JustGiving}
        alt="JustGiving"
        style={{ marginRight: "16px" }}
      />
      <CardContent style={{ flexGrow: 1, textAlign: "left" }}>
        <Typography variant="h5" component="div">
          JustGiving
        </Typography>
        <Typography variant="body" component="div">
          Diversity & Inclusion
        </Typography>
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          Monthly Allocation: £3,500
        </Typography>
      </CardContent>
      <div style={{ textAlign: "right" }}>
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          Total Donated
        </Typography>
        <Typography variant="h4" component="div" style={{ fontSize: "2rem" }}>
          £12,000
        </Typography>
        <Button
          variant="contained"
          disableElevation
          style={{
            color: "black",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            backgroundColor: "white",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          Donate More
        </Button>
      </div>
    </Card>
  );

  const crisisBox = (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: 1,
        borderColor: "darkgray",
        borderRadius: 3,
        width: "85%",
        height: 130,
        padding: "20px",
      }}
    >
      <img
        width={"100"}
        height={"auto"}
        src={Crisis}
        alt="Crisis"
        style={{ marginRight: "16px" }}
      />
      <CardContent style={{ flexGrow: 1, textAlign: "left" }}>
        <Typography variant="h5" component="div">
          Crisis
        </Typography>
        <Typography variant="body" component="div">
          Homelessness
        </Typography>
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          Monthly Allocation: £2,000
        </Typography>
      </CardContent>
      <div style={{ textAlign: "right" }}>
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          Homes Provided
        </Typography>
        <Typography variant="h4" component="div" style={{ fontSize: "2rem" }}>
          25
        </Typography>
        <Button
          variant="contained"
          disableElevation
          style={{
            color: "black",
            borderColor: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            backgroundColor: "white",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          Build More Homes
        </Button>
      </div>
    </Card>
  );

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
        <Typography style={{ marginTop: "20px" }}>
          Minimum of 20 trees.
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trees</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>20 trees</TableCell>
                <TableCell align="right">£4.80</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>200 trees</TableCell>
                <TableCell align="right">£48</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>20,000 trees</TableCell>
                <TableCell align="right">£4,800</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
          justifyContent: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="h1"
            style={{ fontSize: "48px", marginTop: "30px", color: "#6D7580" }}
          >
            Allocation
          </Typography>
          <Typography
            variant="h2"
            style={{ fontSize: "24px", marginBottom: "50px", color: "#858C94" }}
          >
            How your budget is allocated
          </Typography>
        </Box>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {" "}
          {/* Aligned at the top */}
          {userId && <PieChartComponent userId={userId} />}
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              overflowX: "scroll",
              alignItems: "center",
              margin: "30px",
              justifyContent: "flex-start",
              width: "100%", // Ensure the box takes the full width
            }}
          >
            {ecologiDashboardBox}
            {donationDashboardBox}
            {crisisBox}
            {purchaseDialog}
          </Box>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
