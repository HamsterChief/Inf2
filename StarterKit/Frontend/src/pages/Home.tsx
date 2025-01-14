import React from "react";
import { Link } from "react-router-dom";
import ShowList from "../components/ShowList";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>TheatreHub</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Upcoming Theatre Shows</h2>
        <Link to="/cart">
          <button style={{
            padding: "10px 20px",
            fontSize: "14px",
            backgroundColor: "#27839f",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            textDecoration: "none",
            marginRight: "20px", // Verplaats de knop iets naar links
            transition: "background-color 0.3s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d5e76")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#27839f")}
          >
            Go to Cart
          </button>
        </Link>
      </div>
      <ShowList />
    </div>
  );
};

export default HomePage;
