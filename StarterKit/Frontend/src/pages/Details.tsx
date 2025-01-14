import React from "react";
import ShowDetails from "../components/ShowDetails";  // Import the ShowDetails component

const DetailsPage: React.FC = () => {
    return (
        <div>
            <h1>Theatre Show Details</h1>
            <ShowDetails />
        </div>
    );
};

export default DetailsPage;