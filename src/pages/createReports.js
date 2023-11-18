import React from "react";
import Navbar from "../components/navBar";
import { Typography, Container } from "@mui/material";

const CreateReports = () => {

    return (
        <div>
            <Navbar />
      <Container
        style={{ marginLeft: "305px", maxWidth: `calc(100% - 305px)` }}
      >
        <Typography
          variant="h1"
          style={{
            fontSize: "48px",
            marginTop: "30px",
            marginBottom: "20px",
            color: "#6D7580",
          }}
        >
          Create Reports
        </Typography>
        </Container>
        </div>
    )
};
export default CreateReports;
