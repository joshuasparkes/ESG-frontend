import React from "react";
import { Typography, Container, Paper } from "@mui/material";
import NavBarDocs from "../components/navBarDocs";

const Docs = () => {
  return (
    <div>
      <NavBarDocs />
      <Container
        style={{ marginLeft: "250px", maxWidth: `calc(100% - 305px)` }}
      >
        <Paper elevation={0} style={{ padding: "0px" }}>
          <Typography variant="h4">User Guide for Tracsr</Typography>
          <Typography id="getting-started"  variant="subtitle2">Last Updated: 6 Oct 2023</Typography>
          <br />
          <br />
          <Typography variant="body">
            <strong>Getting started with Tracsr</strong>
            
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default Docs;
