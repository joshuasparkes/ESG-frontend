import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  LinearProgress,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Onboarding = () => {
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState(1);
  const [organizationName, setOrganizationName] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [firstName, setFirstName] = useState("");
  const totalScreens = 3; // Set the total number of screens in the onboarding process
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to control snackbar visibility

  const progress = (activeScreen / totalScreens) * 100;

  const saveDataToFirestore = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            businessName: organizationName,
            monthlyBudget: monthlyBudget,
          },
          { merge: true }
        );
        console.log("Data saved successfully");
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    } else {
      // Handle the case where there is no user logged in
      console.log("No user logged in");
    }
  };

  useEffect(() => {
    const fetchFirstName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setFirstName(userData.firstName); // Assuming the field is called 'firstName'
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchFirstName();
  }, []); // Dependency on the current user

  const handleNext = () => {
    setActiveScreen((prevScreen) => prevScreen + 1);
  };

  const handleBack = () => {
    setActiveScreen((prevScreen) => prevScreen - 1);
  };

  const handleSkip = () => {
    if (activeScreen === 1) {
    } else if (activeScreen === 2) {
    }
    handleNext();
  };

  const handleFinish = () => {
    saveDataToFirestore();
    setOpenSnackbar(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1250);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <LinearProgress
        style={{ marginTop: "20px" }}
        variant="determinate"
        value={progress}
      />
      <Grid
        container
        spacing={5}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        {activeScreen === 1 && (
          <Grid style={{ justifyContent: "center", alignItems: "center" }} item>
            <Typography align="center" variant="h5">
              {firstName ? `Hi ${firstName},` : "Welcome,"} we're about to make
              your ESG management journey simple and effective. <br />
              <br /> Let's get started.
            </Typography>
          </Grid>
        )}

        {activeScreen === 2 && (
          <Grid item>
            <Typography align="center" variant="h5">
              Enter your organization name
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </Grid>
        )}

        {activeScreen === 3 && (
          <Grid item>
            <Typography align="center" variant="h5">
              Enter your monthly ESG budget
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Monthly ESG Budget"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">£</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      arrow
                      title="How much budget have you been given to manage your organisation's ESG responsibilities? This is the starting point to effective ESG management"
                    >
                      <HelpOutlineIcon style={{ cursor: "pointer" }} />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
            />
          </Grid>
        )}

        <Grid item container justifyContent="center" spacing={2}>
          {activeScreen > 1 && (
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleBack}
                style={{ marginRight: "8px" }}
              >
                Back
              </Button>
            </Grid>
          )}

          <Grid item>
            <div style={{ display: "flex", alignItems: "center" }}>
              {activeScreen === 1 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleSkip}
                  style={{ margin: "0 8px" }}
                >
                  Skip
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={
                  activeScreen < 3
                    ? handleNext
                    : activeScreen === 3
                    ? handleFinish
                    : null
                }
              >
                {activeScreen === 3 ? "Finish" : "Next"}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Success!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Onboarding;
