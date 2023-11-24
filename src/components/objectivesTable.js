import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ObjectivesTable = () => {
  const [groupedDonations, setGroupedDonations] = useState({});
  const [totalDonated, setTotalDonated] = useState(0);

  useEffect(() => {
    const fetchDonations = async () => {
      const donationsRef = collection(db, "donations");
      const q = query(
        donationsRef,
        where("donatingUser", "==", auth.currentUser?.uid)
      );
      const donationsSnapshot = await getDocs(q);

      let donations = {};
      for (const docSnapshot of donationsSnapshot.docs) {
        const donation = docSnapshot.data();

        const fundRef = doc(db, "funds", donation.linkedFund);
        const fundSnap = await getDoc(fundRef);

        if (fundSnap.exists()) {
          const fund = fundSnap.data();
          const objective = fund.objective;
          donations[objective] = donations[objective] || [];
          donations[objective].push(donation.amount);
        }
      }

      // Now process the grouped donations
      let totalDonated = 0;
      Object.values(donations).forEach((amounts) => {
        totalDonated += amounts.reduce((sum, amount) => sum + amount, 0);
      });

      Object.keys(donations).forEach((objective) => {
        donations[objective] = {
          total: donations[objective].reduce((sum, amount) => sum + amount, 0),
          percentage: (
            (donations[objective].reduce((sum, amount) => sum + amount, 0) /
              totalDonated) *
            100
          ).toFixed(2),
        };
      });

      setGroupedDonations(donations);
      setTotalDonated(totalDonated);
    };

    fetchDonations();
  }, []); // Remove groupedDonations from dependency array

  return (
    <TableContainer elevation={0} sx={{ width: "100%" }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ fontWeight: 500 }}>
            <TableCell>Objective</TableCell>
            <TableCell align="right">Total Amount</TableCell>
            <TableCell align="right">%</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.entries(groupedDonations).map(([objective, data]) => (
            <TableRow key={objective}>
              <TableCell component="th" scope="row">
                {objective}
              </TableCell>
              <TableCell align="right">
                {new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP", // Change to your desired currency if different
                }).format(data.total)}
              </TableCell>
              <TableCell align="right">{data.percentage}%</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell component="th" scope="row">
              Total Donated
            </TableCell>
            <TableCell align="right">
              {new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(totalDonated)}
            </TableCell>
            <TableCell align="right">100%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ObjectivesTable;
