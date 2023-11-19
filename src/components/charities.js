import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
// import { useAuth } from "../components/authContext";
import Tree from "../images/Tree.png";
import JustGiving from "../images/JustGiving.jpg";
import Crisis from "../images/crisis.jpeg";
import PurchaseDialog from "../components/purchaseDialog";

function Charities({ userId }) {
  const [open, setOpen] = useState(false);
  const [treeCount, setTreeCount] = useState(0);

  const handlePurchaseClick = () => {
    setOpen(true);
  };

  const handleTreeCountChange = (event) => {
    setTreeCount(event.target.value);
  };

  function DashboardBox({
    image,
    title,
    subtitle,
    amount,
    buttonText,
    benefitText,
    onClick,
    userId,
  }) {
    const [treesPlanted, setTreesPlanted] = useState(0);

    useEffect(() => {
      if (title === "Ecologi") {
        const fetchUserData = async () => {
          try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              const ecologiUsername = userData.ecologiUsername;

              if (ecologiUsername) {
                const apiUrl = `https://public.ecologi.com/users/${ecologiUsername}/trees`;
                await fetchTreesPlanted(apiUrl);
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };

        const fetchTreesPlanted = async (apiUrl) => {
          try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTreesPlanted(data.total);
          } catch (error) {
            console.error("Error fetching the number of trees planted:", error);
          }
        };

        fetchUserData();
      }
    }, [userId, title]);

    return (
      <Card
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          border: 1,
          borderRadius: 3,
          width: "85%",
          height: 130,
          margin: 1,
          padding: "20px",
        }}
      >
        <img
          width={"100"}
          height={"auto"}
          src={image}
          alt={title}
          style={{ marginRight: "16px" }}
        />
        <CardContent style={{ flexGrow: 1, textAlign: "left" }}>
          <Typography color={"#727272"} variant="h5" component="div">
            {title}
          </Typography>
          <Typography color={"#727272"} variant="body" component="div">
            {subtitle}
          </Typography>
          <Typography sx={{ mt: 1.5 }} color="text.secondary">
            {amount}
          </Typography>
        </CardContent>
        <div style={{ textAlign: "right" }}>
          <Typography sx={{ mt: 1.5 }} color="text.secondary">
            {title === "Ecologi"
              ? `Trees Planted: ${treesPlanted}`
              : benefitText}
          </Typography>
          <Button
            variant="contained"
            disableElevation
            style={{
              color: "#727272",
              borderColor: "#727272",
              borderWidth: "1px",
              borderStyle: "solid",
              marginTop: "16px",
              backgroundColor: "white",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            onClick={onClick}
          >
            {buttonText}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <DashboardBox
        image={Tree}
        title="Ecologi"
        subtitle="Renewable Energy"
        amount={`Monthly Allocation: £2,000`}
        buttonText="Donate"
        benefitText={`Trees Planted:`}
        onClick={handlePurchaseClick}
        userId={userId}
      />
      <DashboardBox
        image={JustGiving}
        title="JustGiving"
        subtitle="Diversity & Inclusion"
        amount="Monthly Allocation: £3,500"
        buttonText="Donate"
        benefitText="Amount Given: £20,000"
      />
      <DashboardBox
        image={Crisis}
        title="Crisis"
        subtitle="Homelessness"
        amount="Monthly Allocation: £2,000"
        buttonText="Donate"
        benefitText="Homes Provided: 244"
      />
      <PurchaseDialog
        open={open}
        handleClose={() => setOpen(false)}
        treeCount={treeCount}
        handleTreeCountChange={handleTreeCountChange}
        handlePurchase={() => {}}
      />
    </>
  );
}

export default Charities;
