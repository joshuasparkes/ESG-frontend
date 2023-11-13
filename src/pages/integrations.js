import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "../components/navBar";
import { AuthContext } from "../components/authContext"; // Import AuthContext
// import Tree from "../images/Tree.png";
// import Logo from "../images/LogoIcon.png";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore instance

function Integrations() {
  const { currentUser } = useContext(AuthContext);
  const [apiKey, setApiKey] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [ecologiUsername, setEcologiUsername] = useState("");

  useEffect(() => {
    // Fetch the existing API key and username when the component loads
    const fetchApiKeyAndUsername = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setApiKey(userDoc.data().ecologiKey || "");
          setEcologiUsername(userDoc.data().ecologiUsername || ""); // Set the Ecologi username
        }
      }
    };

    fetchApiKeyAndUsername();
  }, [currentUser]);

  const saveEcologiKey = async (apiKey, username) => {
    if (!currentUser) {
      console.error("No user is signed in.");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid); // Reference to the user's document
    try {
      await updateDoc(userDocRef, {
        ecologiKey: apiKey,
        ecologiUsername: username,
      });
      console.log("Ecologi API Key saved successfully.");
      setOpenSnackbar(true); // Open the snackbar on successful save
    } catch (error) {
      console.error("Error saving Ecologi API Key:", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Navbar />
      <Container
        style={{ marginLeft: "305px", maxWidth: `calc(100% - 305px)` }}
      >
        <Box my={4}>
          <Typography
            variant="h1"
            style={{
              fontSize: "48px",
              marginTop: "30px",
              marginBottom: "25px",
              color: "#6D7580",
            }}
          >
            Integrations
          </Typography>
          <Paper elevation={0} style={{ border: "1px solid #ddd", padding: '20px' }}>
            <Typography variant="h5">Ecologi</Typography>
            <TextField
              label="Ecologi Username"
              fullWidth
              value={ecologiUsername}
              onChange={(e) => setEcologiUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Ecologi API Key"
              fullWidth
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => saveEcologiKey(apiKey, ecologiUsername)}
            >
              Save Ecologi Information
            </Button>
          </Paper>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Ecologi API Key saved successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Integrations;
