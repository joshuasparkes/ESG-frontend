import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import PieChartIcon from "@mui/icons-material/PieChart";
import { db, auth } from '../firebase';
import { doc, setDoc } from "firebase/firestore";

const Onboarding = () => {
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState(1);
  const [organizationName, setOrganizationName] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const saveDataToFirestore = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          businessName: organizationName,
          monthlyBudget: monthlyBudget
        }, { merge: true });
        console.log("Data saved successfully");
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    } else {
      // Handle the case where there is no user logged in
      console.log("No user logged in");
    }
  };

  const handleNext = () => {
    setActiveScreen((prevScreen) => prevScreen + 1);
  };

  const handleBack = () => {
    setActiveScreen((prevScreen) => prevScreen - 1);
  };

  const handleSkip = () => {
    if (activeScreen === 1) {
      // Skip screen 1 logic (if needed)
    } else if (activeScreen === 2) {
      // Skip screen 2 logic (if needed)
    }
    // Move to the next screen
    handleNext();
  };

  const handleFinish = () => {
    saveDataToFirestore();
    navigate("/dashboard");
  };  

  return (
    <Container maxWidth="sm">
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        {activeScreen === 1 && (
          <Grid style={{ justifyContent: "center", alignItems: 'center' }} item>
            <Typography variant="h5">
              Welcome to Tracsr, the ESG reporting tool for proxy ESG managers
            </Typography>
          </Grid>
        )}

        {activeScreen === 2 && (
          <Grid item>
            <BusinessIcon style={{ fontSize: "3rem" }} />
            <Typography variant="h5">Enter your organization name</Typography>
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
            <PieChartIcon style={{ fontSize: "3rem" }} />
            <Typography variant="h5">Enter your monthly ESG budget</Typography>
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
    </Container>
  );
};

export default Onboarding;
