import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  DialogActions,
  Button,
  TableBody,
} from "@mui/material";

function PurchaseDialog({
  open,
  handleClose,
  treeCount,
  handleTreeCountChange,
  handlePurchase,
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Purchase Trees</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="treeCount"
          label="Number of Trees"
          type="number"
          fullWidth
          variant="standard"
          value={treeCount}
          onChange={handleTreeCountChange}
        />
        <Typography style={{ marginTop: "20px" }}>
          Minimum of 20 trees.
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trees</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>20 trees</TableCell>
                <TableCell align="right">£4.80</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>200 trees</TableCell>
                <TableCell align="right">£48</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>20,000 trees</TableCell>
                <TableCell align="right">£4,800</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>{" "}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handlePurchase} variant="contained" color="primary">
          Purchase
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PurchaseDialog;
