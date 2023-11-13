import React from "react";
import { Typography, Container, Paper } from "@mui/material";

import Navbar from "../components/navBar";

const Learn = () => {
  //   const [items, setItems] = useState([]);
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     async function fetchRSS() {
  //       try {
  //         const response = await fetch("http://localhost:5000/rss");
  //         const data = await response.json();
  //         setItems(data);
  //       } catch (error) {
  //         console.error("Error fetching RSS feed:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }

  //     fetchRSS();
  //   }, []);

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <div>
      <Navbar />
      <Container
        style={{ marginLeft: "305px", maxWidth: `calc(100% - 305px)` }}
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
          Learn about ESG
        </Typography>

        <Paper elevation={0} style={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">
            Learn about how to fulfil your organisation's ESG needs.
          </Typography>
          <Typography variant="h4">Coming Soon</Typography>
          {/* <div>
            {items.map((item, index) => (
              <div key={index}>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            ))}
          </div> */}
        </Paper>
      </Container>
    </div>
  );
};

export default Learn;
