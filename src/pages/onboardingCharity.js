import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { auth } from "../firebase";

const OnboardingCharity = () => {
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState(1);
  const [charityName, setCharityName] = useState("");
  const [charityLocation, setCharityLocation] = useState("");
  const [charityNumber, setCharityNumber] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [websiteAddress, setWebsiteAddress] = useState("");
  const [fundName, setFundName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [fundDescription, setFundDescription] = useState("");
  const totalScreens = 3;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const progress = (activeScreen / totalScreens) * 100;
  const [charityID, setCharityID] = useState("");
  const [pageID, setPageID] = useState(null);

  const handleBack = () => {
    setActiveScreen((prevScreen) => prevScreen - 1);
  };

  const handleSkip = () => {
    if (activeScreen === 1) {
    } else if (activeScreen === 2) {
    }
    handleNext();
  };

  const handleNext = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in.");
      return;
    }

    if (activeScreen === 1) {
      // Create a new charity document with a Firestore-generated ID
      const charityRef = doc(collection(db, "charities"));
      await setDoc(charityRef, {
        name: charityName,
        location: charityLocation,
        number: charityNumber,
        charityLead: user.uid,
      });
      const generatedCharityID = charityRef.id;
      setCharityID(generatedCharityID); // Save the generated Charity ID for later use
      console.log("Generated Charity ID:", generatedCharityID);
    } else if (activeScreen === 2) {
      // Save page details to a new document with a Firestore-generated ID
      const pageRef = doc(collection(db, "pages"));
      console.log("Set Page ID: ", pageRef.id);

      await setDoc(pageRef, {
        title: pageTitle,
        description: pageDescription,
        website: websiteAddress,
        linkedCharity: charityID, // Linking the page to the charity
      });
      const generatedPageID = pageRef.id;
      setPageID(generatedPageID); // Save the generated Page ID for later use
      console.log("Generated Page ID:", generatedPageID);
    }

    setActiveScreen((prevScreen) => prevScreen + 1);
  };

  const handleFinish = async () => {
    console.log("Saving Fund with Charity ID: ", charityID, " and Page ID: ", pageID);
    if (fundName && targetAmount && fundDescription) {
      try {
        await addDoc(collection(db, "funds"), {
          fundName,
          targetAmount,
          fundDescription,
          createdBy: auth.currentUser?.uid,
          linkedCharity: charityID,
          linkedPage: pageID,
        });
        console.log("Fund information saved successfully");
      } catch (error) {
        console.error("Error saving fund information: ", error);
      }
    }

    setOpenSnackbar(true);
    setTimeout(() => {
      navigate("/myCharity");
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
          <Grid item>
            <Typography align="center" variant="h5">
              Create a Charity
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Charity Name"
              value={charityName}
              onChange={(e) => setCharityName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Location"
              value={charityLocation}
              onChange={(e) => setCharityLocation(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Charity Number"
              value={charityNumber}
              onChange={(e) => setCharityNumber(e.target.value)}
            />
          </Grid>
        )}

        {activeScreen === 2 && (
          <Grid item>
            <Typography align="center" variant="h5">
              Create a Page
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Page Name"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Page Description"
              value={pageDescription}
              onChange={(e) => setPageDescription(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Website"
              value={websiteAddress}
              onChange={(e) => setWebsiteAddress(e.target.value)}
            />
          </Grid>
        )}

        {activeScreen === 3 && (
          <Grid item>
            <Typography align="center" variant="h5">
              Create a Fund{" "}
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Fund Name"
              value={fundName}
              onChange={(e) => setFundName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Target Amount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Fund Description"
              value={fundDescription}
              onChange={(e) => setFundDescription(e.target.value)}
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

export default OnboardingCharity;
