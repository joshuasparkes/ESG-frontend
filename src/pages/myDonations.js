import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import Navbar from "../components/navBar";
import {
  Typography,
  Container,
  TextField,
  List,
  ListItem,
  Paper,
  ListItemText,
} from "@mui/material";
import BackButton from "../components/back";
import { useNavigate } from "react-router-dom";

const MyDonations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]); // Add this state for filtered search results

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("No user logged in");
        return;
      }

      const userDonationsQuery = query(
        collection(db, "donations"),
        where("donatingUser", "==", currentUser.uid),
        orderBy("createdAt", "desc") // Assuming donations have a 'createdAt' field
      );

      const donationsSnapshot = await getDocs(userDonationsQuery);
      const donationsData = await Promise.all(
        donationsSnapshot.docs.map(async (docSnapshot) => {
          const donation = docSnapshot.data();
          const fundRef = doc(db, "funds", donation.linkedFund);
          const fundSnap = await getDoc(fundRef);
          const fundData = fundSnap.data();

          // Format amount in GBP with comma for thousands
          const formattedAmount = new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
          }).format(donation.amount);

          // Format createdAt date
          const createdAt = donation.createdAt
            ? donation.createdAt.toDate()
            : new Date();
          const formattedCreatedAt = createdAt.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return {
            id: docSnapshot.id,
            amount: formattedAmount,
            fundName: fundData ? fundData.fundName : "Unknown Fund",
            createdAt: formattedCreatedAt,
            linkedFund: donation.linkedFund, // Ensure this is correctly set
            objective: donation.objective, // Ensure this is correctly set
          };
        })
      );

      setDonations(donationsData);
    };

    fetchDonations();
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      // Filter the existing donations list
      const filtered = donations.filter((donation) =>
        donation.fundName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDonations(filtered);
    } else {
      // Reset the filtered donations list if the search query is empty
      setFilteredDonations([]);
    }
  };

  const handleViewFund = (fundId) => {
    console.log("Navigating to fund with ID:", fundId);
    navigate(`/fund/${fundId}`);
  };

  const renderDonations = (donationList) => {
    return donationList.map((donation, index) => (
      <ListItem
        key={index}
        onClick={() =>
          donation.linkedFund && handleViewFund(donation.linkedFund)
        } // Ensure linkedFund exists
        elevation={0}
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          textAlign: "left",
          borderTop: "0px",
          borderRight: "0px",
          borderLeft: "0px",
          borderBottom: "1px solid #d3d3d3",
          borderRadius: "0px",
          cursor: "pointer", // Add cursor pointer for better UX
        }}
      >
        <ListItemText
          primary={`Donation: ${donation.amount}`}
          secondary={`Fund: ${donation.fundName}`}
        />
        <Typography
          style={{
            fontSize: "12px",
            textAlign: "left",
          }}
        >
          Donated on {donation.createdAt}
        </Typography>
      </ListItem>
    ));
  };

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
          My Donations
          <BackButton />
        </Typography>

        <TextField
          fullWidth
          label="Search Donations by Fund"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />

        <Paper elevation={0} style={{ marginTop: "20px" }}>
          <List>
            {
              searchQuery && filteredDonations.length > 0
                ? renderDonations(filteredDonations) // Show filtered search results if search query is present
                : renderDonations(donations) // Show all donations otherwise
            }
          </List>
        </Paper>
      </Container>
    </div>
  );
};

export default MyDonations;
