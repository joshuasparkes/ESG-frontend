import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../images/LogoIcon.png";
import Screenshot from '../images/screenshot1.png'

function LandingPage() {
  const [selected, setSelected] = useState(0);
  const [email, setEmail] = useState("");

  const items = [
    {
      name: "Environmental Impact",
      content:
        "Strategies to reduce carbon footprint and improve sustainability.",
    },
    {
      name: "Social Responsibility",
      content: "Initiatives to benefit community and employee welfare.",
    },
    {
      name: "Corporate Governance",
      content: "Ethical practices for long-term corporate health.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailData = {
      subject: "Tracsr Email Capture",
      body: `Email: ${email}`,
    };

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        alert("Demo request sent successfully!");
      } else {
        alert("Failed to send demo request.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending demo request.");
    }
  };

  return (
    <div>
      <div className="top-bar">
        <img src={Logo} alt="Logo" className="logo" height={100} />
        <div className="top-bar-buttons">
          <Link to="/signIn" className="top-bar-button">
            Sign In
          </Link>
          <Link to="/signUp" className="top-bar-button">
            Sign Up
          </Link>
        </div>
      </div>
      <div className="container1">
        <h1 className="title">Tracsr</h1>
        <h2 className="subtitle">
          Next gen reporting on your business' ESG budget allocation.
        </h2>
        <form onSubmit={handleSubmit} className="demo-form">
          <input
            className="email-input"
            type="email"
            placeholder="I'm Interested!"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="email-submit">
            Submit
          </button>
        </form>
      </div>
      <div className="container1b">
        <img className="screenshot" src={Screenshot} alt='screenshot'/>
      </div>
      <div className="container2">
        <div className="problem-section">
          <h2 className="section-header">Core Areas</h2>
          <ul>
            {items.map((item, index) => (
              <li
                key={index}
                style={{
                  backgroundColor:
                    selected === index ? "#fff" : "rgba(255,255,255,.2)",
                }}
                onClick={() => setSelected(index)}
              >
                <strong
                  style={{
                    fontSize: "1.4rem",
                  }}
                >
                  {item.name}
                </strong>
                <div
                  className="bubble-body"
                  style={{ display: selected === index ? "block" : "none" }}
                >
                  {item.content}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
