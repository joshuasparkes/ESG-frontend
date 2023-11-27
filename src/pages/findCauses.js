import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import Navbar from "../components/navBar";
import {
  TextField,
  Typography,
  Container,
  Button,
  Paper,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import TabPanel from "../components/TabPanel";
import { useNavigate } from "react-router-dom";

const FindCauses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [funds, setFunds] = useState([]);
  // eslint-disable-next-line
  const [allData, setAllData] = useState({
    funds: [],
    charities: [],
    pages: [],
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const fetchFunds = async () => {
      const fundsSnapshot = await getDocs(collection(db, "funds"));
      const fetchedFunds = fundsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFunds(fetchedFunds);
      setResults(fetchedFunds); // Initialize results with all funds
    };

    fetchFunds();
  }, []);

  useEffect(() => {
    const fetchUserType = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserType(userSnap.data().userType);
        }
      }
    };

    fetchUserType();
  }, []);

  const handleViewFund = (fundId) => {
    console.log("Navigating to fund with ID:", fundId);
    navigate(`/fund/${fundId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fundsSnapshot = await getDocs(collection(db, "funds"));
      const charitiesSnapshot = await getDocs(collection(db, "charities"));
      const pagesSnapshot = await getDocs(collection(db, "pages"));

      setAllData({
        funds: fundsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        charities: charitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        pages: pagesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      });
    };

    fetchData();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSearch = () => {
    if (searchQuery) {
      let filteredData = funds.filter(
        (fund) =>
          (fund.fundName &&
            fund.fundName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (fund.fundDescription &&
            fund.fundDescription
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (fund.objective &&
            fund.objective.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setResults(filteredData);
    } else {
      setResults(funds); // Reset results to show all funds if search query is empty
    }
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
          Causes
          <Button
            variant="outlined"
            color="primary"
            style={{ float: "right", marginBottom: "10px", marginLeft: "10px" }}
            onClick={() => navigate("/myDonations")}
          >
            My Donations
          </Button>
          {userType === "charity" && (
            <Button
              variant="contained"
              color="primary"
              style={{ float: "right", marginBottom: "10px" }}
              onClick={() => navigate("/myCharity")}
            >
              My Causes
            </Button>
          )}
        </Typography>

        <TextField
          fullWidth
          label="Search for causes"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Paper elevation={0} style={{ marginTop: "20px" }}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Funds" />
            {/* <Tab label="Pages" /> */}
            {/* <Tab label="Charities" /> */}
          </Tabs>
          <TabPanel value={currentTab} index={2}>
            {/* Render filtered charities */}
            <List>
              Charities are under development
              {results.map((result, index) => (
                <ListItem
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    textAlign: "left",
                    borderWidth: "1px",
                    borderBottom: "1px solid #d3d3d3",
                    borderRadius: "0px",
                  }}
                  key={index}
                >
                  <ListItemText
                    primary={result.name || result.fundName || result.title}
                    secondary={
                      result.location ||
                      result.fundDescription ||
                      result.description
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <List>
              Pages are under development
              {results.map((result, index) => (
                <ListItem
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    textAlign: "left",
                    borderWidth: "0px",
                    borderBottom: "1px solid #d3d3d3",
                    borderRadius: "0px",
                  }}
                  key={index}
                >
                  <ListItemText
                    primary={result.name || result.fundName || result.title}
                    secondary={
                      result.location ||
                      result.fundDescription ||
                      result.description
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
          <TabPanel value={currentTab} index={0}>
            <List>
              {results.length > 0 ? (
                results.map((result, index) => (
                  <ListItem
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      textAlign: "left",
                      borderBottom: "1px solid #d3d3d3",
                    }}
                    key={index}
                    button
                    onClick={() => handleViewFund(result.id)}
                  >
                    <ListItemText
                      sx={{ width: "70%" }}
                      primary={result.name || result.fundName || result.title}
                      secondary={result.fundDescription || result.description}
                    />
                    <Typography variant="body2">{result.objective}</Typography>
                  </ListItem>
                ))
              ) : (
                <Typography
                  variant="subtitle1"
                  style={{ padding: "10px", textAlign: "center" }}
                >
                  No causes found.
                </Typography>
              )}
            </List>
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
};

export default FindCauses;
