import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Container,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Navbar from "../components/navBar";
// import { auth, doc, getDoc, db } from "../firebase";
import Tree from "../images/Tree.png";
import Logo from "../images/LogoIcon.png";

function Integrations() {
  const zoomIntegrationEnabled = useState(false);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         const userRef = doc(db, "users", user.uid);
//         const docSnapshot = await getDoc(userRef);
//         if (docSnapshot.exists()) {
//           const zoomUserId = docSnapshot.data().zoom_user_id;
//           if (zoomUserId) {
//             setZoomIntegrationEnabled(true);
//           }
//         }
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleZoomToggle = () => {
//     setZoomIntegrationEnabled(!zoomIntegrationEnabled);
//   };

//   const handleConnectToZoom = () => {
//     const user = auth.currentUser;
//     if (user) {
//       setZoomIntegrationEnabled(true);
//       const firebaseUid = user.uid; // Fetch the Firebase UID

//       // Log or debug the firebaseUid to make sure it's not null or undefined
//       console.log("Firebase UID:", firebaseUid);

//       const zoomAuthorizationUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=ybKPAft6SSyBirKyRpWw&redirect_uri=https://therapinsights.onrender.com/zoom/callback&state=${firebaseUid}`;

//       // Log the complete URL to debug
//       console.log("Zoom Authorization URL:", zoomAuthorizationUrl);

//       window.location.href = zoomAuthorizationUrl;
//     } else {
//       console.log("User not authenticated.");
//     }
//   };

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

          <Paper elevation={1}>
            <Box p={4} display="flex" flexDirection="row" alignItems="center">
              <img
                width={"auto"}
                height={"100px"}
                style={{}}
                src={Tree}
                alt="Softkraft process"
              />
              {zoomIntegrationEnabled ? (
                <span
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    color: "#6D7580",
                    padding: "10px",
                    border: "2px solid, #6D7580",
                    borderRadius: "8px",
                  }}
                >
                  {" "}
                  Connected{" "}
                </span>
              ) : (
                <span
                //   onClick={handleConnectToZoom}
                  style={{
                    marginLeft: "20px",
                    cursor: "pointer",
                    backgroundColor: "#6D7580",
                    color: "white",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  Connect to Ecologi
                </span>
              )}
              <Box style={{ marginLeft: "30px" }} mb={2} mt={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={zoomIntegrationEnabled}
                    //   onChange={handleZoomToggle}
                      name="zoomIntegration"
                      color="primary"
                    />
                  }
                />
              </Box>
            </Box>
          </Paper>

          <Paper elevation={1}>
            <Box p={4} display="flex" flexDirection="row" alignItems="center">
              <img
                width={"auto"}
                height={"100px"}
                style={{}}
                src={Logo}
                alt="Softkraft process"
              />
              {zoomIntegrationEnabled ? (
                <span
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    color: "#6D7580",
                    padding: "10px",
                    border: "2px solid, #6D7580",
                    borderRadius: "8px",
                  }}
                >
                  {" "}
                  Connected{" "}
                </span>
              ) : (
                <span
                //   onClick={handleConnectToZoom}
                  style={{
                    marginLeft: "20px",
                    cursor: "pointer",
                    backgroundColor: "#6D7580",
                    color: "white",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  Connect to JustGiving
                </span>
              )}
              <Box style={{ marginLeft: "30px" }} mb={2} mt={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={zoomIntegrationEnabled}
                    //   onChange={handleZoomToggle}
                      name="zoomIntegration"
                      color="primary"
                    />
                  }
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default Integrations;
