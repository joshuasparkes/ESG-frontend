import React, { useState, useEffect } from "react";
import { Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../components/authContext";
import Navbar from "../components/navBar";
import PieChartComponent from "../components/pie";
import Charities from "../components/charities";
import PurchaseDialog from "../components/purchaseDialog";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [treeCount, setTreeCount] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/signIn");
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  const handlePurchaseClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTreeCountChange = (event) => {
    setTreeCount(event.target.value);
  };

  useEffect(() => {
    let isComponentMounted = true;

    const fetchUserProfile = async () => {
      if (currentUser && currentUser.uid) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists() && isComponentMounted) {
          updateUserProfile(userDocSnapshot.data());
        }
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }

    return () => {
      isComponentMounted = false;
    };
  }, [currentUser, updateUserProfile]);

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
          <PieChartComponent userId={userId} />
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              overflowX: "scroll",
              alignItems: "center",
              margin: "30px",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <Charities handlePurchaseClick={handlePurchaseClick} />
          </Box>
        </div>
      </Container>
      <PurchaseDialog
        open={open}
        handleClose={handleClose}
        treeCount={treeCount}
        handleTreeCountChange={handleTreeCountChange}
        handlePurchase={() => {}}
      />
    </div>
  );
}

export default Dashboard;
