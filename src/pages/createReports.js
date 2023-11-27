import React from "react";
import Navbar from "../components/navBar";
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

const CreateReports = () => {
  const mockReports = [
    { date: "2023-01-01", id: 1 },
    { date: "2023-02-01", id: 2 },
    { date: "2023-03-01", id: 3 },
    { date: "2023-04-01", id: 4 },
    { date: "2023-05-01", id: 5 },
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
          Reports
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right", marginBottom: "20px" }}
          >
            Generate Report
          </Button>
        </Typography>
        <TableContainer elevation={0} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date Generated</TableCell>
                <TableCell align="right">Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell component="th" scope="row">
                    {report.date}
                  </TableCell>
                  <TableCell align="right">
                    <Button>
                      <DownloadForOfflineIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default CreateReports;
