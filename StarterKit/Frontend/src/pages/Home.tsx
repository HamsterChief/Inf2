import React from "react";
import ShowList from "../components/ShowList";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>TheatreHub</h1>
      <h2>Upcoming Theatre Shows</h2>
      <ShowList />
    </div>
  );
};

export default HomePage;