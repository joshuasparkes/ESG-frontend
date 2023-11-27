import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Import your Firebase configuration
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Navbar from "../components/navBar";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ListItemText,
  Collapse,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { UNobjectives } from "../constants";
import BackButton from "../components/back";


const MyCharity = () => {
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [funds, setFunds] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [openAddPageDialog, setOpenAddPageDialog] = useState(false);
  const [openAddFundDialog, setOpenAddFundDialog] = useState(false);
  const [fundName, setFundName] = useState("");
  const [fundDescription, setFundDescription] = useState("");
  const [fundTargetAmount, setFundTargetAmount] = useState("");
  const [objective, setObjective] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [pageWebsite, setPageWebsite] = useState("");
  const [openAddCharityDialog, setOpenAddCharityDialog] = useState(false);
  const [charityName, setCharityName] = useState("");
  const [charityLocation, setCharityLocation] = useState("");
  const [charityNumber, setCharityNumber] = useState("");
  const [addingForCharityId, setAddingForCharityId] = useState(null);
  const [addingForPageId, setAddingForPageId] = useState(null);
  const navigate = useNavigate();

  const handleAddCharity = async () => {
    try {
      const charityRef = await addDoc(collection(db, "charities"), {
        name: charityName,
        location: charityLocation,
        number: charityNumber,
        charityLead: auth.currentUser.uid,
        createdAt: serverTimestamp(), // Add createdAt field
      });
      console.log("Charity added with ID: ", charityRef.id);
      // Update the charities state
      setCharities((prevCharities) => [
        ...prevCharities,
        {
          id: charityRef.id,
          name: charityName,
          location: charityLocation,
          number: charityNumber,
        },
      ]);
      setCharityName("");
      setCharityLocation("");
      setCharityNumber("");
      setOpenAddCharityDialog(false);
    } catch (error) {
      console.error("Error adding charity: ", error);
    }
  };

  const handleAddPage = async () => {
    try {
      const pageRef = await addDoc(collection(db, "pages"), {
        title: pageTitle,
        description: pageDescription,
        website: pageWebsite,
        linkedCharity: addingForCharityId, // Use addingForCharityId here
        createdAt: serverTimestamp(), // Add createdAt field
      });

      console.log("Page added with ID: ", pageRef.id);
      setPages((prevPages) => [
        ...prevPages,
        {
          id: pageRef.id,
          title: pageTitle,
          description: pageDescription,
          website: pageWebsite,
        },
      ]);

      // Clear the input fields, close the dialog, and reset the addingForCharityId
      setPageTitle("");
      setPageDescription("");
      setPageWebsite("");
      setOpenAddPageDialog(false);
      setAddingForCharityId(null); // Reset addingForCharityId here
    } catch (error) {
      console.error("Error adding page: ", error);
    }
  };

  const handleAddFund = async () => {
    try {
      const fundRef = await addDoc(collection(db, "funds"), {
        fundName: fundName,
        fundDescription: fundDescription,
        targetAmount: parseFloat(fundTargetAmount),
        objective: objective,
        linkedPage: addingForPageId, // Use addingForPageId here
        createdAt: serverTimestamp(), // Add createdAt field
      });

      console.log("Fund added with ID: ", fundRef.id);

      setFunds((prevFunds) => [
        ...prevFunds,
        {
          id: fundRef.id,
          fundName: fundName,
          fundDescription: fundDescription,
          targetAmount: parseFloat(fundTargetAmount),
          objective: objective,
        },
      ]);

      setFundName("");
      setFundDescription("");
      setFundTargetAmount("");
      setObjective("");
      setOpenAddFundDialog(false);
    } catch (error) {
      console.error("Error adding fund: ", error);
    }
  };

  useEffect(() => {
    const fetchCharities = async () => {
      const user = auth.currentUser;
      if (user) {
        const charitiesRef = collection(db, "charities");
        const q = query(charitiesRef, where("charityLead", "==", user.uid));
        try {
          const querySnapshot = await getDocs(q);
          const fetchedCharities = [];
          querySnapshot.forEach((doc) => {
            fetchedCharities.push({ id: doc.id, ...doc.data() });
          });
          setCharities(fetchedCharities);
        } catch (error) {
          console.error("Error fetching charities: ", error);
        }
      }
    };

    fetchCharities();
  }, []);

  const handleEdit = (itemId, itemType, currentTitle) => {
    setEditingItem({ id: itemId, type: itemType });
    setEditedTitle(currentTitle);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    const refPath =
      editingItem.type === "charity"
        ? "charities"
        : editingItem.type === "page"
        ? "pages"
        : "funds";

    const updateField =
      editingItem.type === "charity"
        ? { name: editedTitle }
        : editingItem.type === "page"
        ? { title: editedTitle }
        : { fundName: editedTitle };

    const itemRef = doc(db, refPath, editingItem.id);

    try {
      await updateDoc(itemRef, updateField);
      console.log("Item updated successfully");

      // Update local state
      if (editingItem.type === "charity") {
        setCharities((prevCharities) =>
          prevCharities.map((charity) =>
            charity.id === editingItem.id
              ? { ...charity, name: editedTitle }
              : charity
          )
        );
      } else if (editingItem.type === "page") {
        setPages((prevPages) =>
          prevPages.map((page) =>
            page.id === editingItem.id ? { ...page, title: editedTitle } : page
          )
        );
      } else {
        setFunds((prevFunds) =>
          prevFunds.map((fund) =>
            fund.id === editingItem.id
              ? { ...fund, fundName: editedTitle }
              : fund
          )
        );
      }

      setEditingItem(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  const handleSelectCharity = async (charityId) => {
    if (charityId === selectedCharity) {
      // Collapse the currently selected charity
      setSelectedCharity(null);
      setPages([]);
    } else {
      // Expand the selected charity and fetch its pages
      setSelectedCharity(charityId);
      setSelectedPage(null); // Reset selected page

      const pagesRef = collection(db, "pages");
      const q = query(pagesRef, where("linkedCharity", "==", charityId));
      try {
        const querySnapshot = await getDocs(q);
        const fetchedPages = [];
        querySnapshot.forEach((doc) => {
          fetchedPages.push({ id: doc.id, ...doc.data() });
        });
        setPages(fetchedPages);
      } catch (error) {
        console.error("Error fetching pages: ", error);
      }
    }
  };

  const handleSelectPage = async (pageId) => {
    if (pageId === selectedPage) {
      // Collapse the currently selected page
      setSelectedPage(null);
      setFunds([]);
    } else {
      // Expand the selected page and fetch its funds
      setSelectedPage(pageId);

      const fundsRef = collection(db, "funds");
      const q = query(fundsRef, where("linkedPage", "==", pageId));
      try {
        const querySnapshot = await getDocs(q);
        const fetchedFunds = [];
        querySnapshot.forEach((doc) => {
          fetchedFunds.push({ id: doc.id, ...doc.data() });
        });
        setFunds(fetchedFunds);
      } catch (error) {
        console.error("Error fetching funds: ", error);
      }
    }
  };

  const handleOpenAddPageDialog = (charityId) => {
    setAddingForCharityId(charityId); // Set the charity ID for adding a new page
    setOpenAddPageDialog(true);
  };

  const handleOpenAddFundDialog = (pageId) => {
    setAddingForPageId(pageId); // Set the page ID for adding a new fund
    setOpenAddFundDialog(true);
  };

  const handleViewFund = (fundId) => {
    navigate(`/fund/${fundId}`);
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
          My Causes

          <Button
            variant="contained"
            color="primary"
            style={{
              float: "right",
              marginBottom: "10px",
              justifySelf: "center",
            }}
            onClick={() => setOpenAddCharityDialog(true)}
            >
            New Charity
          </Button>
            <BackButton/>
        </Typography>
        <Paper elevation={0} style={{ padding: "10px", marginTop: "20px" }}>
          <List>
            {charities.map((charity) => (
              <React.Fragment key={charity.id}>
                <ListItem
                  button
                  onClick={() => handleSelectCharity(charity.id)}
                  style={{ borderBottom: "1px lightgrey solid" }}
                >
                  {editingItem &&
                  editingItem.id === charity.id &&
                  editingItem.type === "charity" ? (
                    <div>
                      <TextField
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                      <Button
                        onClick={() => handleSaveEdit(charity.id, "charity")}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ListItemText
                        primary={charity.name}
                        secondary={charity.location}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenAddPageDialog(charity.id)}
                      >
                        Add Page
                      </Button>
                      <Button
                        onClick={() =>
                          handleEdit(charity.id, "charity", charity.name)
                        }
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </ListItem>
                <Collapse
                  in={selectedCharity === charity.id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {pages.map((page) => (
                      <React.Fragment key={page.id}>
                        <ListItem
                          button
                          style={{
                            paddingLeft: "20px",
                            borderBottom: "1px lightgrey solid",
                          }}
                          onClick={() => handleSelectPage(page.id)}
                        >
                          <div
                            style={{
                              writingMode: "vertical-lr",
                              transform: "rotate(180deg)",
                              textAlign: "center",
                              color: "darkred",
                              left: 1,
                              marginRight: "20px",
                              alignSelf: "stretch", // Stretches the div to the full height of the ListItem
                            }}
                          >
                            Page
                          </div>
                          {editingItem &&
                          editingItem.id === page.id &&
                          editingItem.type === "page" ? (
                            <div>
                              <TextField
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                              />
                              <Button
                                onClick={() => handleSaveEdit(page.id, "page")}
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <>
                              <ListItemText
                                primary={page.title}
                                secondary={page.description}
                              />
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleOpenAddFundDialog(page.id)}
                              >
                                Add Fund
                              </Button>
                              <Button
                                onClick={() =>
                                  handleEdit(page.id, "page", page.title)
                                }
                              >
                                Edit
                              </Button>
                            </>
                          )}
                        </ListItem>
                        <Collapse
                          in={selectedPage === page.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List
                            component="div"
                            disablePadding
                            style={{
                              paddingLeft: "102px",
                            }}
                          >
                            {funds.map((fund) => (
                              <ListItem
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                                key={fund.id}
                              >
                                <div
                                  style={{
                                    writingMode: "vertical-lr",
                                    transform: "rotate(180deg)",
                                    textAlign: "center",
                                    color: "darkblue",
                                    left: 1,
                                    marginRight: "20px",
                                    alignSelf: "stretch", // Stretches the div to the full height of the ListItem
                                  }}
                                >
                                  Fund
                                </div>

                                {editingItem &&
                                editingItem.id === fund.id &&
                                editingItem.type === "fund" ? (
                                  <div>
                                    <TextField
                                      value={editedTitle}
                                      onChange={(e) =>
                                        setEditedTitle(e.target.value)
                                      }
                                    />
                                    <Button
                                      onClick={() =>
                                        handleSaveEdit(fund.id, "fund")
                                      }
                                    >
                                      Save
                                    </Button>
                                  </div>
                                ) : (
                                  <>
                                    <ListItemText
                                      primary={fund.fundName}
                                      secondary={`Target: £${fund.targetAmount}`}
                                    />
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <Button
                                        onClick={() => handleViewFund(fund.id)}
                                      >
                                        View
                                      </Button>

                                      <Button
                                        onClick={() =>
                                          handleEdit(
                                            fund.id,
                                            "fund",
                                            fund.fundName
                                          )
                                        }
                                      >
                                        Edit
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
      <Dialog
        open={openAddPageDialog}
        onClose={() => setOpenAddPageDialog(false)}
      >
        <DialogTitle>Add New Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Page Title"
            required
            fullWidth
            variant="outlined"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={pageDescription}
            onChange={(e) => setPageDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Website Address"
            fullWidth
            variant="outlined"
            value={pageWebsite}
            onChange={(e) => setPageWebsite(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPageDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPage}>Add Page</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding a new fund */}
      <Dialog
        open={openAddFundDialog}
        onClose={() => setOpenAddFundDialog(false)}
      >
        <DialogTitle>Add New Fund</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Fund Name"
            fullWidth
            required
            variant="outlined"
            value={fundName}
            onChange={(e) => setFundName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={fundDescription}
            onChange={(e) => setFundDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Target Amount"
            fullWidth
            required
            variant="outlined"
            value={fundTargetAmount}
            onChange={(e) => setFundTargetAmount(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="objective-select-label">Objective</InputLabel>
            <Select
              labelId="objective-select-label"
              id="objective-select"
              value={objective}
              required
              label="Objective"
              onChange={(e) => setObjective(e.target.value)}
            >
              {UNobjectives.map((obj, index) => (
                <MenuItem key={index} value={obj}>
                  {obj}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddFundDialog(false)}>Cancel</Button>
          <Button onClick={handleAddFund}>Add Fund</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddCharityDialog}
        onClose={() => setOpenAddCharityDialog(false)}
      >
        <DialogTitle>Add New Charity</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            margin="dense"
            required
            fullWidth
            variant="outlined"
            value={charityName}
            onChange={(e) => setCharityName(e.target.value)}
          />
          <TextField
            label="Location"
            fullWidth
            margin="dense"
            value={charityLocation}
            onChange={(e) => setCharityLocation(e.target.value)}
          />
          <TextField
            label="Number"
            fullWidth
            margin="dense"
            value={charityNumber}
            onChange={(e) => setCharityNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddCharityDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleAddCharity} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyCharity;
