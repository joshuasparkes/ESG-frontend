import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DocsLogo from "../images/tracsr-docs.png";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";

function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = (section) => {
    window.location.hash = `#${section}`;
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
            src={DocsLogo}
            alt="PMAI Logo"
            style={{ width: "100px", marginBottom: "0px", marginTop: "15px" }}
          />
          <List style={{ width: "100%" }}>
            <ListItem
              button
              key="Getting Started"
              onClick={() => handleNavigation("getting-started")}
            >
              <ListItemIcon>
                <PlayCircleFilledWhiteIcon />
              </ListItemIcon>
              <ListItemText primary="Getting Started" />
            </ListItem>

            <ListItem
              button
              key="Zoom"
              onClick={() => handleNavigation("zoom")}
            >
              <ListItemIcon>
                <DownloadForOfflineIcon />
              </ListItemIcon>
              <ListItemText primary="Zoom" />
            </ListItem>

            <ListItem
              button
              key="Support"
              onClick={() => handleNavigation("contact-support")}
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItem>
          </List>
        </div>

        <List style={{ width: "100%" }}>
          <ListItem button key="Exit" onClick={() => navigate("/")}>
            <ListItemIcon>
              <ExitToAppRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Exit" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default Navbar;
