import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Logo from "../images/LogoIcon.png";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebase";
import LinkIcon from "@mui/icons-material/Link";
import BugReportIcon from "@mui/icons-material/BugReport";
import SchoolIcon from "@mui/icons-material/School";
import ArticleIcon from '@mui/icons-material/Article';

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
      case "Report":
        navigate("/report");
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
            style={{ width: "50px", marginBottom: "20px", marginTop: "30px" }}
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
              key="Report"
              onClick={() => handleNavigation("Report")}
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Create Report" />
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
            key="Report an Issue"
            onClick={() => handleNavigation("Report an Issue")}
          >
            <ListItemIcon>
              <BugReportIcon />
            </ListItemIcon>
            <ListItemText primary="Report an Issue" />
          </ListItem>

          <ListItem
            button
            key="settings"
            onClick={() => handleNavigation("settings")}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
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
