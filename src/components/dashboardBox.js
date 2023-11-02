import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import treeImage from "../images/Tree.png"; // Adjust the path as necessary
import beamImage from "../images/beam.png"; // Adjust the path as necessary
// import PeopleIcon from "@mui/icons-material/People";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const DashboardBox = ({ icon, title, subtitle, number }) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        height: 250,
        margin: 2,
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <CardContent>
        {icon}
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {subtitle}
        </Typography>
        <Typography variant="body2" style={{ fontSize: "1.5rem" }}>
          {number}
        </Typography>
      </CardContent>
    </Card>
  );
};

const DashboardBoxes = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <DashboardBox
            icon={
              <img
                src={treeImage}
                alt="Tree"
                style={{ width: "100px", height: "100px" }}
              />
            } // Adjust the style as needed
            title="Ecologi"
            subtitle="Trees Planted"
            number="125"
          />
        </Grid>
        <Grid item>
          <DashboardBox
            icon={
              <img
                src={beamImage}
                alt="Tree"
                style={{ width: "100px", height: "100px" }}
              />
            } // Adjust the style as needed
            title="Beam"
            subtitle="Fight Homelessness"
            number="+ Add Provider"
          />
        </Grid>
        <Grid item>
          <DashboardBox
            icon={<AddCircleOutlineIcon style={{ fontSize: "100px" }} />} // Adjust the fontSize as needed
            title="Providers"
            subtitle="Insert Benefits"
            number="+ Add Provider"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardBoxes;
