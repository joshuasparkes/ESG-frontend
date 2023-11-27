import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Logo from "../images/tracsr-logomark-type-white.png";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import { useNavigate } from "react-router-dom";
import { auth, signOut, db } from "../firebase";
// import LinkIcon from "@mui/icons-material/Link";
import BugReportIcon from "@mui/icons-material/BugReport";
import SchoolIcon from "@mui/icons-material/School";
import ArticleIcon from "@mui/icons-material/Article";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import SearchIcon from "@mui/icons-material/Search";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  useEffect(() => {
    const fetchUserType = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserType(userSnap.data().userType); // Assuming the field is called 'userType'
        }
      }
    };

    fetchUserType();
  }, []);

  const handleNavigation = (page) => {
    switch (page) {
      case "myCharity":
        navigate("/myCharity");
        break;
      case "findCauses":
        navigate("/findCauses");
        break;
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "Integrations":
        navigate("/integrations");
        break;
      case "My Apps":
        navigate("/myApps");
        break;
      case "report":
        navigate("/report");
        break;
      case "Learn":
        navigate("/learn");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "Docs":
        window.open("/docs", "_blank");
        break;
      case "CreateReports":
        navigate("/createReports");
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Drawer
        open={true}
        variant="permanent"
        PaperProps={{
          style: {
            width: "230px",
            backgroundColor: "black",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            color: "#727272",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            src={Logo}
            alt="PMAI Logo"
            style={{
              width: "100px",
              marginBottom: "20px",
              marginTop: "30px",
              alignSelf: "flex-start",
              marginLeft: "15px",
            }}
          />
          <List style={{ width: "100%" }}>
            <ListItem
              button
              key="Dashboard"
              onClick={() => handleNavigation("Dashboard")}
            >
              <ListItemIcon>
                <DonutSmallIcon style={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }} primary="Insights" />
            </ListItem>

            <ListItem
              button
              key="findCauses"
              onClick={() => handleNavigation("findCauses")}
            >
              <ListItemIcon>
                <SearchIcon style={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }} primary="Causes" />
            </ListItem>

            {/* <ListItem
              button
              key="myCharity"
              onClick={() => handleNavigation("myCharity")}
            >
              <ListItemIcon>
                <VolunteerActivismIcon style={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }} primary="My Charities" />
            </ListItem> */}
            <ListItem
              button
              key="Create Reports"
              onClick={() => handleNavigation("CreateReports")}
            >
              <ListItemIcon>
                <ArticleIcon style={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                style={{ color: "white" }}
                primary="Reports"
              />
            </ListItem>

            <ListItem
              button
              key="Learn"
              onClick={() => handleNavigation("Learn")}
            >
              <ListItemIcon>
                <SchoolIcon style={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                style={{ color: "white" }}
                primary="Learn"
              />
            </ListItem>

            {/* <ListItem
                  button
                  key="Integrations"
                  onClick={() => handleNavigation("Integrations")}
                >
                  <ListItemIcon>
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Integrations" />
                </ListItem> */}
          </List>
        </div>

        <List style={{ width: "100%" }}>
          <ListItem button key="Docs" onClick={() => handleNavigation("Docs")}>
            <ListItemIcon>
              <HelpCenterIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText style={{ color: "white" }} primary="Docs" />
          </ListItem>

          <ListItem
            button
            key="report"
            onClick={() => handleNavigation("report")}
          >
            <ListItemIcon>
              <BugReportIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              style={{ color: "white" }}
              primary="Report an Issue"
            />
          </ListItem>

          <ListItem button key="SignOut" onClick={handleSignOut}>
            <ListItemIcon>
              <ExitToAppRoundedIcon style={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText style={{ color: "white" }} primary="Sign Out" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default Navbar;
