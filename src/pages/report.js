import React, { useState } from "react";
import {
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { doc, setDoc, getFirestore } from "firebase/firestore";

import Navbar from "../components/navBar";

const Report = () => {
  const [feedback, setFeedback] = React.useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const db = getFirestore();
    const feedbackRef = doc(db, "feedback", new Date().toISOString());

    await setDoc(feedbackRef, {
      feedback: feedback,
      timestamp: new Date(),
    });

    setFeedback("");
    setSubmitted(true); // Set submitted to true to show the Snackbar
  };

  return (
    <div>
      <Navbar />
      <Container
        style={{ marginLeft: "305px", maxWidth: `calc(100% - 305px)` }}
      >
        <Typography
          variant="h1"
          style={{
            fontSize: "48px",
            marginTop: "30px",
            marginBottom: "20px",
            color: "#6D7580",
          }}
        >
          Support
        </Typography>

        <Paper elevation={0} style={{ padding: "20px" }}>
          <Typography variant="h6">Send Us Your Feedback</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Feedback"
                  variant="outlined"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Paper elevation={0} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">Support Team Hours</Typography>
          <Typography variant="body2">
            Monday to Sunday: 9am to 8pm GMT
          </Typography>
        </Paper>

        <Paper elevation={0} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">First Response SLA</Typography>
          <Typography variant="body2">
            Expect a response within 24 hours
          </Typography>
        </Paper>

        <Paper elevation={0} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">Contact Options</Typography>
          <ul>
            <li>
              <a href="mailto:joshsparkes6@gmail.com">Email Support</a>
            </li>
            <li>
              <a href="https://therapinsights.com/docs">
                Knowledge Base/Forums
              </a>
            </li>
            <li>
              <a href="tel:+44 7493 291 667">Phone Support: +44 7493 291 667</a>
            </li>
          </ul>
        </Paper>

        <Snackbar
          open={submitted}
          autoHideDuration={6000}
          onClose={() => setSubmitted(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setSubmitted(false)} severity="success">
            Your feedback has been submitted!
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default Report;
