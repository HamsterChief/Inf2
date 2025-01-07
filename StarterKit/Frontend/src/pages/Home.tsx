import React from "react";
import ShowList from "../Components/ShowList";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Upcoming Theatre Shows</h1>
      <ShowList />
    </div>
  );
};

export default HomePage;
