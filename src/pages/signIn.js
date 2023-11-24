import React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Logo from "../images/LogoIcon.png";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signInWithEmailAndPassword, auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import GoogleIcon from "../components/googleIcon";

const defaultTheme = createTheme();

  export default function SignInSide() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = React.useState("");
  
    const handleGoogleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();
        console.log(`Firebase ID token: ${idToken}`);
  
        fetchUserType(user);
      } catch (error) {
        console.error("Error signing in with Google:", error);
        setErrorMessage(
          "An error occurred with Google Sign-In. Please try again."
        );
      }
    };
  
    const fetchUserType = async (user) => {
      // Fetch userType similar to the other component
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userType = userSnap.data().userType; // Set userType from Firestore data
  
        // Redirect based on userType
        if (userType === "charity") {
          navigate("/myCharity");
        } else if (userType === "donor") {
          navigate("/dashboard");
        } else {
          // Handle other user types or scenarios here
        }
      }
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const password = data.get("password");
  
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
  
        fetchUserType(user);
      } catch (error) {
        console.error("Error signing in:", error.code);
        let userFriendlyMessage = "";
        switch (error.code) {
          case "auth/wrong-password":
            userFriendlyMessage = "Invalid password. Please try again.";
            break;
          case "auth/invalid-login-credentials":
            userFriendlyMessage = "No user found with this email address.";
            break;
          case "auth/user-not-found":
            userFriendlyMessage = "No user found with this email address.";
            break;
          case "auth/user-disabled":
            userFriendlyMessage = "This account has been disabled.";
            break;
          default:
            userFriendlyMessage = "An error occurred. Please try again.";
        }
        setErrorMessage(userFriendlyMessage); // Set the user-friendly error message
      }
    };
  
    const handleForgotPassword = () => {
      window.location.href = `mailto:joshsparkes6@gmail.com?subject=Password Reset&body=Please help me reset my password.`;
    };
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1444664361762-afba083a4d77?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            backgroundRepeat: "repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "contain", // Adjust this value as needed
            backgroundPosition: "right",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
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
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
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
                Sign In
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
                variant="contained"
                sx={{ mt: 2 }}
                style={{
                  padding: "10px",
                  backgroundColor: "#4285F4",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "18px",
                }}
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
                Sign In with Google
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" onClick={handleForgotPassword}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
            {errorMessage && (
              <Typography
                variant="body2"
                style={{ color: "red", marginTop: "20px" }}
              >
                {errorMessage}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
