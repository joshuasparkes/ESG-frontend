import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Logo from "../images/LogoIcon.png";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebase";

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
      case "My Conversations":
        navigate("/myConversations");
        break;
      case "My Apps":
        navigate("/myApps");
        break;
      case "Report an Issue":
        navigate("/contact");
        break;
      case "Calendar":
        navigate("/calendar");
        break;
      case "settings":
        navigate("/settings");
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
                <DonutSmallIcon
                // style={{ color: selectedPage === "Dashboard" ? "#4CAB61" : "#727272" }}
                />
              </ListItemIcon>
              <ListItemText primary="Active Causes" />
            </ListItem>

            {/* <ListItem
              button
              key="My Apps"
              onClick={() => handleNavigation("My Apps")}
            >
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Add Causes" />
            </ListItem> */}

            {/* <ListItem
              button
              key="Calendar"
              onClick={() => handleNavigation("Calendar")}
            >
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Meetings" />
            </ListItem> */}
          </List>
        </div>

        <List style={{ width: "100%" }}>
          {/* <ListItem
            button
            key="Report an Issue"
            onClick={() => handleNavigation("Report an Issue")}
          >
            <ListItemIcon>
              <BugReportIcon />
            </ListItemIcon>
            <ListItemText primary="Report an Issue" />
          </ListItem> */}

          {/* <ListItem
            button
            key="settings"
            onClick={() => handleNavigation("settings")}
          >
            <ListItemIcon>
              <ToggleOnRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItem> */}

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
