import React, { useState, useEffect } from "react";
import { Avatar, Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../components/authContext";
import Navbar from "../components/navBar";
import PieChartComponent from "../components/pie";
// import Charities from "../components/charities";
import ObjectivesTable from "../components/objectivesTable";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");

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

  const handleAvatarClick = () => {
    navigate("/settings");
  };

  useEffect(() => {
    let isComponentMounted = true;

    const fetchUserProfile = async () => {
      if (currentUser && currentUser.uid) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists() && isComponentMounted) {
          const userData = userDocSnapshot.data();

          updateUserProfile(userData);
          setBusinessName(userData.businessName);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        }
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }

    return () => {
      isComponentMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const getInitials = (name) => {
    return name ? name[0] : "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <Container
        style={{
          flexGrow: 1,
          marginLeft: "250px",
          maxWidth: `calc(100% - 305px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: "30px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                alignContent: "flex-end",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Typography variant="h5" style={{ color: "#6D7580" }}>
                {firstName} {lastName}
              </Typography>
            </div>

            <Typography
              style={{ color: "#6D7580" }}
              align="right"
              variant="body"
            >
              {businessName}
            </Typography>
          </div>
          <Avatar style={{ cursor: "pointer" }} onClick={handleAvatarClick}>
            {getInitials(businessName)}
          </Avatar>
        </Box>
        <Box>
          <Typography
            variant="h1"
            style={{ fontSize: "48px", marginTop: "30px", color: "#6D7580" }}
          >
            Insights
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
            {/* <Charities userId={userId} /> */}
            <ObjectivesTable />
          </Box>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
