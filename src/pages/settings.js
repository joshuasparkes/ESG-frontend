import React, { useState } from "react";
import { Box, Paper, Typography, Container, TextField, Button } from "@mui/material";
import Navbar from "../components/navBar";
import { getAuth, updatePassword, sendEmailVerification } from "firebase/auth";

function Settings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  const handleUpdate = async () => {
    try {
      if (user) {
        // Update password if provided
        if (password) {
          await updatePassword(user, password);
          console.log("Password updated.");
        }

        // Send verification email if the email is changed
        if (email && email !== user.email) {
          await sendEmailVerification(user, { url: 'https://esg-frontend.pages.dev/settings' });
          console.log("Verification email sent. Please verify your new email.");
          // Note: You should handle the actual email update after verification,
          // possibly in another part of your application.
        }
      } else {
        console.log("No user is signed in.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <Container style={{ marginLeft: "305px", maxWidth: `calc(100% - 305px)` }}>
        <Box my={4}>
          <Typography variant="h1" style={{ fontSize: "48px", marginBottom: "50px", marginTop: "30px", color: "#6D7580" }}>
            Settings
          </Typography>
          <Paper elevation={0}>
            <Box p={3}>
              <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" />
              <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" />
              <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Update
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default Settings;
