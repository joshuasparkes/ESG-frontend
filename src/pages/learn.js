import React from "react";
import { Typography, Container, Paper, Box } from "@mui/material";

import Navbar from "../components/navBar";

const Learn = () => {
  const boxData = [
    {
      imageSrc:
        "https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Replace with actual image paths
      header:
        "Navigating the New Wave of ESG: Transforming Corporations for a Sustainable Future",
      body: "Explore how modern corporations are adopting ESG principles to not only enhance their sustainability but also to drive innovation and growth in a rapidly changing world.",
    },
    {
      imageSrc:
        "https://images.pexels.com/photos/1292464/pexels-photo-1292464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      header:
        "Policy Shifts and Profit: The Impact of ESG Regulations on Business",
      body: "Delve into the latest policy changes in the ESG arena and understand their implications for businesses striving to stay compliant and competitive.",
    },
    {
      imageSrc:
        "https://images.pexels.com/photos/6632286/pexels-photo-6632286.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      header: "Setting the ESG Compass: A Step-by-Step Guide for Businesses",
      body: "Learn the essentials of integrating ESG into your business framework with practical steps and strategies for a successful implementation.      ",
    },
    {
      imageSrc:
        "https://images.pexels.com/photos/3299275/pexels-photo-3299275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      header: "ESG Pitfalls: Common Challenges and How to Overcome Them",
      body: "Uncover the typical obstacles businesses face in ESG integration and discover effective solutions to navigate these challenges successfully.      ",
    },
    {
      imageSrc:
        "https://images.pexels.com/photos/3735146/pexels-photo-3735146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      header:
        "From Compliance to Advantage: Leveraging ESG for Business Success",
      body: "See how businesses can transform ESG compliance from a regulatory requirement into a strategic advantage that propels growth and innovation.      ",
    },
  ];

  return (
    <div>
      <Navbar />
      <Container
        style={{ marginLeft: "250px", maxWidth: `calc(100% - 305px)` }}
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
          Learn
        </Typography>

        {boxData.map((item, index) => (
          <Paper
            key={index}
            elevation={0}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px",
              marginBottom: "20px",
              border: "1px darkgrey solid",
              borderRadius: "8px",
            }}
          >
            <Box style={{ marginRight: "20px" }}>
              <img
                src={item.imageSrc}
                alt={`Box ${index}`}
                style={{ width: "100px", height: "100px", borderRadius: "8px" }}
              />
            </Box>
            <Box>
              <Typography variant="h6">{item.header}</Typography>
              <Typography variant="body1">{item.body}</Typography>
            </Box>
          </Paper>
        ))}
      </Container>
    </div>
  );
};

export default Learn;
