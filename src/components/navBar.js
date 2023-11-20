import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Logo from "../images/tracsr-logomark-type.png";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebase";
import LinkIcon from "@mui/icons-material/Link";
import BugReportIcon from "@mui/icons-material/BugReport";
import SchoolIcon from "@mui/icons-material/School";
import ArticleIcon from "@mui/icons-material/Article";
import HelpCenterIcon from '@mui/icons-material/HelpCenter'

function Navbar() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const navigate = useNavigate();

  const handleNavigation = (page) => {
    switch (page) {
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "Integrations":
        navigate("/integrations");
        break;
      case "My Apps":
        navigate("/myApps");
        break;
      case "Report an Issue":
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
            width: "305px",
            backgroundColor: "white",
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
            style={{ width: "100px", marginBottom: "0px", marginTop: "10px" }}
          />
          <List style={{ width: "100%" }}>
            <ListItem
              button
              key="Dashboard"
              onClick={() => handleNavigation("Dashboard")}
            >
              <ListItemIcon>
                <DonutSmallIcon />
              </ListItemIcon>
              <ListItemText primary="Allocation" />
            </ListItem>

            <ListItem
              button
              key="Integrations"
              onClick={() => handleNavigation("Integrations")}
            >
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary="Integrations" />
            </ListItem>

            <ListItem
              button
              key="Create Reports"
              onClick={() => handleNavigation("CreateReports")}
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Create Reports" />
            </ListItem>

            <ListItem
              button
              key="Learn"
              onClick={() => handleNavigation("Learn")}
            >
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Learn About ESG" />
            </ListItem>
          </List>
        </div>

        <List style={{ width: "100%" }}>
        <ListItem
            button
            key="Docs"
            onClick={() => handleNavigation("Docs")}
          >
            <ListItemIcon>
              <HelpCenterIcon />
            </ListItemIcon>
            <ListItemText primary="Docs" />
          </ListItem>
          <ListItem
            button
            key="Docs"
            onClick={() => handleNavigation("Docs")}
          >
            <ListItemIcon>
              <BugReportIcon />
            </ListItemIcon>
            <ListItemText primary="Report an Issue" />
          </ListItem>

          <ListItem button key="SignOut" onClick={handleSignOut}>
            <ListItemIcon>
              <ExitToAppRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default Navbar;
