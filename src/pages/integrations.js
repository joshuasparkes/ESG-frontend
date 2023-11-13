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

  useEffect(() => {
    // Fetch the existing API key when the component loads
    const fetchApiKey = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setApiKey(userDoc.data().ecologiKey || "");
        }
      }
    };

    fetchApiKey();
  }, [currentUser]);

  const saveEcologiKey = async (apiKey) => {
    if (!currentUser) {
      console.error("No user is signed in.");
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid); // Reference to the user's document
    try {
      await updateDoc(userDocRef, { ecologiKey: apiKey });
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
          <Paper elevation={0}>
            <Typography variant="h5">Ecologi</Typography>
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
              onClick={() => saveEcologiKey(apiKey)}
            >
              Save API Key
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
