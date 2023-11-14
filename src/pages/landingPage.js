import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from '../images/LogoIcon.png'

function LandingPage() {
  const [selected, setSelected] = useState(0);

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

  return (
    <div>
    <div className="top-bar">
      <img src={Logo} alt="Logo" className="logo" height={100}/>
      <div className="top-bar-buttons">
        <Link to="/signIn" className="btn btn-secondary">Sign In</Link>
        <Link to="/signUp" className="btn btn-secondary">Sign Up</Link>
      </div>
    </div>
    <div className="container1">
        <h1 className="title">Tracsr</h1>
        <h2 className="subtitle">
          Next gen reporting on your business' ESG budget allocation.
        </h2>
        <div className="btn-container">
          <Link
            style={{
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: "#000",
              border: "black 2px solid",
              fontWeight: "400px",
              width: "200px",
            }}
            className="btn btn-secondary"
            to="/dashboard"
          >
            Access Dashboard
          </Link>
          <Link
            style={{
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: "#000",
              border: "black 2px solid",
              fontWeight: "400px",
              width: "200px",
            }}
            className="btn btn-secondary"
            to="/signUp"
          >
            Sign Up
          </Link>
        </div>
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
