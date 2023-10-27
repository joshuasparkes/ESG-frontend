import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Logo from "../images/LogoIcon.png";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db, createUserWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleIcon from "../components/googleIcon";

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState("");

  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store additional user info in Firestore, if needed.
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: user.displayName,
        lastName: "", // or extract from user object
        email: user.email,
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setErrorMessage("An error occurred while signing in with Google.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      console.log(`Firebase ID token: ${idToken}`);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: serverTimestamp(),
      });
      navigate("/dashboard");
      setErrorMessage(""); // Clear any existing error message
    } catch (error) {
      console.error("Error signing up:", error.code);
      let userFriendlyMessage = "";
      switch (error.code) {
        case "auth/email-already-in-use":
          userFriendlyMessage = "Email already in use. Please choose another.";
          break;
        case "auth/weak-password":
          userFriendlyMessage = "Weak password. Choose a stronger one.";
          break;
        case "auth/invalid-email":
          userFriendlyMessage = "Invalid email format.";
          break;
        case "auth/operation-not-allowed":
          userFriendlyMessage = "Sign-up disabled. Please contact support.";
          break;
        default:
          userFriendlyMessage = "An error occurred. Please try again.";
      }
      setErrorMessage(userFriendlyMessage); // Set the user-friendly error message
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={Logo}
            alt="PMAI Logo"
            height={"50px"}
            style={{ marginBottom: "20px" }}
          />

          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{
                padding: "10px",
                backgroundColor: "black",
                color: "white",
                borderRadius: "8px",
                fontSize: "18px",
              }}
            >
              Sign Up
            </Button>
            <Typography
              style={{
                alignSelf: "center",
                textAlign: "center",
                width: "100%",
              }}
            >
              or
            </Typography>
            <Button
              fullWidth
              style={{
                padding: "10px",
                backgroundColor: "#4285F4",
                color: "white",
                borderRadius: "8px",
                fontSize: "18px",
              }}
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleGoogleSignIn}
              startIcon={
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "50%",
                    height: "40px",
                    width: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <GoogleIcon />
                </div>
              }
            >
              Sign Up with Google
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signIn" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Typography
            variant="caption"
            style={{ color: "red", marginTop: "20px" }}
          >
            {errorMessage}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
