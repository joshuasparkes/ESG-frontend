import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import Navbar from "../components/navBar";
import { Modal, Button, TextField, Box, InputAdornment } from "@mui/material";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import BackButton from "../components/back";

const FundPage = () => {
  const [fundDetails, setFundDetails] = useState({
    fundName: "",
    fundDescription: "",
    objective: "",
    targetAmount: 0,
  });
  const [donationAmount, setDonationAmount] = useState("");
  const [userType, setUserType] = useState(null);
  const [openDonateModal, setOpenDonateModal] = useState(false);
  const [editableFundName, setEditableFundName] = useState(
    fundDetails.fundName
  );
  const [editableObjective, setEditableObjective] = useState(
    fundDetails.objective
  );
  const [editableFundDescription, setEditableFundDescription] = useState(
    fundDetails.fundDescription
  );
  const [editableTargetAmount, setEditableTargetAmount] = useState(
    fundDetails.targetAmount
  );
  const [donations, setDonations] = useState([]);
  const { fundId } = useParams();
  const totalDonations = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );
  const progressPercentage = (totalDonations / fundDetails.targetAmount) * 100;

  const handleSaveChanges = async () => {
    try {
      const fundRef = doc(db, "funds", fundId);

      const updatedFundData = {
        fundName: editableFundName,
        objective: editableObjective,
        fundDescription: editableFundDescription,
        targetAmount: parseFloat(editableTargetAmount) || 0,
      };

      await updateDoc(fundRef, updatedFundData);

      // Optionally, update the local fundDetails state to reflect the changes
      setFundDetails(updatedFundData);

      console.log("Fund details updated successfully");
    } catch (error) {
      console.error("Error updating fund details:", error);
    }
  };

  useEffect(() => {
    setEditableFundName(fundDetails.fundName);
    setEditableObjective(fundDetails.objective);
    setEditableFundDescription(fundDetails.fundDescription);
    setEditableTargetAmount(fundDetails.targetAmount);
  }, [fundDetails]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const q = query(
          collection(db, "donations"),
          where("linkedFund", "==", fundId)
        );
        const querySnapshot = await getDocs(q);
        const fetchedDonations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDonations(fetchedDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [fundId]); // Dependency array ensures this runs when fundId changes

  useEffect(() => {
    const fetchFundDetails = async () => {
      try {
        const docRef = doc(db, "funds", fundId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFundDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching fund details:", error);
      }
    };

    fetchFundDetails();
  }, [fundId]); //

  const handleDonate = async () => {
    try {
      const numericAmount = parseFloat(donationAmount);

      if (!isNaN(numericAmount) && numericAmount > 0) {
        const newDonation = {
          donatingUser: auth.currentUser?.uid,
          amount: numericAmount,
          linkedFund: fundId,
          createdAt: serverTimestamp() // Add createdAt field here
        };

        const docRef = await addDoc(collection(db, "donations"), newDonation);

        setDonations([...donations, { ...newDonation, id: docRef.id }]);

        setOpenDonateModal(false);
        setDonationAmount("");
      } else {
        console.error("Invalid donation amount");
      }
    } catch (error) {
      console.error("Error adding donation: ", error);
    }
  };

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid); // Assuming users are stored in a 'users' collection
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserType(userData.userType); // Set the userType in state
          } else {
            console.log("User document not found");
          }
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, []); // Empty dependency array to run only once after component mounts

  return (
    <div>
      <Navbar />
      <Container
        style={{
          marginLeft: "250px",
          maxWidth: `calc(100% - 305px)`,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          <Typography
            variant="h1"
            style={{
              fontSize: "48px",
              color: "#6D7580",
            }}
          >
            Fund
          </Typography>
          <BackButton />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {userType === "charity" ? (
            <TextField
              variant="outlined"
              label="Fund Name"
              value={editableFundName}
              onChange={(e) => setEditableFundName(e.target.value)}
            />
          ) : (
            <Typography variant="h4">{fundDetails.fundName}</Typography>
          )}

          {userType === "charity" ? (
            <TextField
              variant="outlined"
              label="Objective"
              value={editableObjective}
              onChange={(e) => setEditableObjective(e.target.value)}
            />
          ) : (
            <Typography variant="h5">{fundDetails.objective}</Typography>
          )}

          {userType === "charity" ? (
            <TextField
              variant="outlined"
              label="Fund Description"
              multiline
              rows={4}
              value={editableFundDescription}
              onChange={(e) => setEditableFundDescription(e.target.value)}
            />
          ) : (
            <Typography variant="body1">
              {fundDetails.fundDescription}
            </Typography>
          )}

          {userType === "charity" ? (
            <TextField
              variant="outlined"
              label="Target Amount"
              type="number"
              value={editableTargetAmount}
              onChange={(e) => setEditableTargetAmount(e.target.value)}
            />
          ) : (
            <Typography variant="h4">
              Target: £
              {new Intl.NumberFormat("en-GB").format(fundDetails.targetAmount)}
            </Typography>
          )}

          {userType === "charity" && (
            <Button
              onClick={handleSaveChanges}
              variant="outlined"
              color="primary"
              sx={{ width: "33%", height: "50px" }}
            >
              Save Changes
            </Button>
          )}
        </div>

        <Typography>
          Current: £{new Intl.NumberFormat("en-GB").format(totalDonations)}
        </Typography>
        <div
          style={{
            position: "relative",
            width: "50%",
            overflow: "hidden",
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            style={{ height: "20px", borderRadius: "10px" }}
          />
          <Typography
            variant="body1"
            style={{
              position: "relative",
              width: "100%",
              textAlign: "center",
              color: "grey",
            }}
          >
            {progressPercentage.toFixed(0)}%
          </Typography>
        </div>

        {/* {userType === "charity" ? <div></div> : <div></div>} */}

        <Button
          style={{ width: "200px" }}
          variant="contained"
          onClick={() => setOpenDonateModal(true)}
        >
          Donate
        </Button>
        <Typography variant="h6">Donations</Typography>
        {donations.map((donation, index) => (
          <Typography
            style={{
              color: "black",
              border: "1px grey solid",
              borderRadius: "8px",
              padding: "10px",
              width: "66%",
              marginBottom: "0px",
            }}
            key={index}
          >
            £{new Intl.NumberFormat("en-GB").format(donation.amount)}
          </Typography>
        ))}
      </Container>

      <Modal
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        open={openDonateModal}
        onClose={() => setOpenDonateModal(false)}
      >
        <Box
          style={{
            backgroundColor: "white",
            width: "50%",
            height: "50%",
            borderRadius: "12px",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4">Donate</Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "20px",
            }}
          >
            <TextField
              label="Amount"
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">£</InputAdornment>
                ),
                inputProps: {
                  min: "0",
                  step: "any",
                },
              }}
            />
            <Button
              sx={{ width: "33%", height: "50px", marginTop: "20px" }}
              variant={"contained"}
              onClick={handleDonate}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default FundPage;
