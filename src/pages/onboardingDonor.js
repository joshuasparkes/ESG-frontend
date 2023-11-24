import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  LinearProgress,
  Tooltip,
  Snackbar,
  Alert,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const OnboardingDonor = () => {
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState(1);
  const [organizationName, setOrganizationName] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [firstName, setFirstName] = useState("");
  const totalScreens = 6;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const progress = (activeScreen / totalScreens) * 100;

  const goalCategories = [
    {
      category: "Environmental Goals",
      goals: [
        "Carbon Footprint Reduction",
        "Sustainable Resource Use",
        "Renewable Energy Transition",
        "Biodiversity and Conservation",
      ],
    },
    {
      category: "Social Goals",
      goals: [
        "Diversity and Inclusion",
        "Community Engagement",
        "Employee Wellbeing and Safety",
        "Ethical Supply Chain Management",
      ],
    },
    {
      category: "Governance Goals",
      goals: [
        "Ethical Business Practices",
        "Board Diversity and Structure",
        "Stakeholder Engagement",
        "Compliance and Reporting",
      ],
    },
  ];

  const [selectedGoals, setSelectedGoals] = useState([]);

  const handleGoalSelection = (event, category, goalName) => {
    const updatedGoals = [...selectedGoals];

    // Check if the goal is already selected
    const existingGoalIndex = updatedGoals.findIndex(
      (goal) => goal.category === category && goal.goalName === goalName
    );

    if (existingGoalIndex !== -1) {
      // Goal is already selected, remove it
      updatedGoals.splice(existingGoalIndex, 1);
    } else {
      // Goal is not selected, add it
      updatedGoals.push({ category, goalName });
    }

    setSelectedGoals(updatedGoals);
  };

  const saveDataToFirestore = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Create an array of selected goal names
        const selectedGoalNames = selectedGoals.map(
          (goal) => `${goal.category}: ${goal.goalName}`
        );

        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            businessName: organizationName,
            monthlyBudget: monthlyBudget,
            esgGoals: selectedGoalNames, // Save selected goals here
          },
          { merge: true }
        );
        console.log("Data saved successfully");
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    } else {
      // Handle the case where there is no user logged in
      console.log("No user logged in");
    }
  };

  useEffect(() => {
    const fetchFirstName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setFirstName(userData.firstName); // Assuming the field is called 'firstName'
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchFirstName();
  }, []); // Dependency on the current user

  const handleNext = () => {
    setActiveScreen((prevScreen) => prevScreen + 1);
  };

  const handleBack = () => {
    setActiveScreen((prevScreen) => prevScreen - 1);
  };

  const handleSkip = () => {
    if (activeScreen === 1) {
    } else if (activeScreen === 2) {
    }
    handleNext();
  };

  const handleFinish = () => {
    saveDataToFirestore();
    setOpenSnackbar(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1250);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <LinearProgress
        style={{ marginTop: "20px" }}
        variant="determinate"
        value={progress}
      />
      <Grid
        container
        spacing={5}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        {activeScreen === 1 && (
          <Grid style={{ justifyContent: "center", alignItems: "center" }} item>
            <Typography align="center" variant="h5">
              {firstName ? `Hi ${firstName},` : "Welcome,"} we're about to make
              your ESG management journey simple and effective. <br />
              <br /> Let's get started.
            </Typography>
          </Grid>
        )}

        {activeScreen === 2 && (
          <Grid item>
            <Typography variant="h5" style={{ textAlign: "center" }}>
              What is ESG?
            </Typography>
            <Typography
              variant="body1"
              style={{ marginTop: "16px", textAlign: "center" }}
            >
              ESG stands for Environmental, Social, and Governance. It's a
              framework used by organizations to assess the impact of their
              operations on the environment, society, and how they are governed.
              ESG criteria help in determining how a company safeguards the
              environment, manages relationships with employees, suppliers,
              customers, and the communities where it operates, as well as its
              leadership, executive pay, audits, internal controls, and
              shareholder rights.
            </Typography>
          </Grid>
        )}

        {activeScreen === 3 && (
          <Grid item>
            <Typography variant="h5" style={{ textAlign: "center" }}>
              How Tracsr Helps
            </Typography>
            <Typography
              variant="body1"
              style={{ marginTop: "16px", textAlign: "center" }}
            >
              Tracsr simplifies ESG budget management for your organization. It
              guides you through allocating funds to various ESG initiatives,
              tracks the impact of your contributions, and provides insightful
              analytics and reports. With Tracsr, managing your ESG
              responsibilities becomes more straightforward, efficient, and
              impactful, allowing you to focus on making a real difference in
              areas that matter most to your business and society.
            </Typography>
          </Grid>
        )}

        {activeScreen === 4 && (
          <Grid item>
            <Typography align="center" variant="h5">
              Enter your organization name
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </Grid>
        )}

        {activeScreen === 5 && (
          <Grid item>
            <Typography align="center" variant="h5">
              Which of the following goals do you want to pursue?
            </Typography>
            {goalCategories.map((category) => (
              <Accordion elevation={0} key={category.category}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{category.category}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {category.goals.map((goal) => (
                      <label key={goal}>
                        <Checkbox
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                          checked={selectedGoals.some(
                            (selectedGoal) =>
                              selectedGoal.category === category.category &&
                              selectedGoal.goalName === goal
                          )}
                          onChange={(event) =>
                            handleGoalSelection(event, category.category, goal)
                          }
                        />
                        {goal}
                      </label>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        )}

        {activeScreen === 6 && (
          <Grid item>
            <Typography align="center" variant="h5">
              Enter your monthly ESG budget
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Monthly ESG Budget"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">£</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      arrow
                      title="How much budget have you been given to manage your organisation's ESG responsibilities? This is the starting point to effective ESG management"
                    >
                      <HelpOutlineIcon style={{ cursor: "pointer" }} />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
            />
          </Grid>
        )}

        <Grid item container justifyContent="center" spacing={2}>
          {activeScreen > 1 && (
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleBack}
                style={{ marginRight: "8px" }}
              >
                Back
              </Button>
            </Grid>
          )}

          <Grid item>
            <div style={{ display: "flex", alignItems: "center" }}>
              {activeScreen === 1 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleSkip}
                  style={{ margin: "0 8px" }}
                >
                  Skip
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={
                  activeScreen < 6
                    ? handleNext
                    : activeScreen === 6
                    ? handleFinish
                    : null
                }
              >
                {activeScreen === 6 ? "Finish" : "Next"}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Success!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OnboardingDonor;
