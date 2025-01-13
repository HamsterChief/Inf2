import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ShowList.css";

export interface Show {
  id: number;
  name: string;
  description: string;
  venue: {
    venueId: number;
    name: string;
    capacity: number;
    theatreShows: any[]; // Aangenomen dat het een lijst van shows is
  };
  price: number;
  theatreShowDates: {
    theatreShowDateId: number;
    dateAndTime: string;
  }[]; // Nu een lijst van datums
}

const ShowList: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [venues, setVenues] = useState<string[]>([]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get("api/v1/theatreshow/all");
        const rawData = response.data;
        console.log("API Response:", rawData); // Log de volledige response om te kijken naar de structuur
    
        const transformedShows: Show[] = rawData.map((item: any) => {
          console.log("Processing item:", item); // Log elk item om te controleren of we `futureDates` kunnen vinden
          
          const futureDates = item.theatreShowDates ? item.theatreShowDates : []; // Checken of theatreShowDates bestaat
          console.log("Future Dates:", futureDates); // Log futureDates om te zien wat we krijgen
    
          // Return de show met de datums als ze bestaan
          return {
            id: item.theatreShowId,
            name: item.title,
            description: item.description,
            price: item.price,
            venue: {
              venueId: item.venueId,
              name: item.venue.name,
              capacity: item.venue.capacity,
            },
            theatreShowDates: futureDates.map((date: any) => ({
              theatreShowDateId: date.theatreShowDateId,
              dateAndTime: date.dateAndTime,
            })),
          };
        });

        console.log("Transformed Shows:", transformedShows); // Log transformedShows om te kijken wat we krijgen
    
        // Extract unique venues
        const extractedVenues = [
          ...new Set(transformedShows.map((show) => show.venue.name)),
        ];
    
        setShows(transformedShows);
        setVenues(extractedVenues);
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShows();
  }, []);

  const filteredShows = shows
    .filter((show) =>
      [show.name, show.description]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .filter((show) => (selectedVenue ? show.venue.name === selectedVenue : true))
    .filter((show) => {
      if (!selectedMonth) return true;
      const showMonth = new Date(show.theatreShowDates[0]?.dateAndTime).getMonth() + 1;
      return parseInt(selectedMonth) === showMonth;
    })
    .sort((a, b) => {
      if (sortOption === "A-Z") return a.name.localeCompare(b.name);
      if (sortOption === "Z-A") return b.name.localeCompare(a.name);
      if (sortOption === "price-lowest") return a.price - b.price;
      if (sortOption === "price-highest") return b.price - a.price;
      if (sortOption === "date-ascending")
        return new Date(a.theatreShowDates[0]?.dateAndTime).getTime() - new Date(b.theatreShowDates[0]?.dateAndTime).getTime();
      if (sortOption === "date-descending")
        return new Date(b.theatreShowDates[0]?.dateAndTime).getTime() - new Date(a.theatreShowDates[0]?.dateAndTime).getTime();
      return 0;
    });

  if (loading) {
    return <p>Loading shows...</p>;
  }

  return (
    <div className="show-list-container">
      {/* Filters section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
        >
          <option value="">All Venues</option>
          {venues.map((venue) => (
            <option key={venue} value={venue}>
              {venue}
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(0, month - 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="price-lowest">Price: Lowest</option>
          <option value="price-highest">Price: Highest</option>
          <option value="date-ascending">Date: Ascending</option>
          <option value="date-descending">Date: Descending</option>
        </select>
      </div>

      {/* Shows list section */}
      <ul className="show-list">
        {filteredShows.map((show) => (
          <li key={show.id} className="show-item">
            <Link to={`/shows/${show.id}`} className="show-link">
              <h3>{show.name}</h3>
              <p>{show.venue.name} - ${show.price.toFixed(2)}</p>
              <p>{show.description}</p>
            </Link>
            <ul className="show-dates">
              {show.theatreShowDates.map((date) => (
                <li key={date.theatreShowDateId}>
                  {new Date(date.dateAndTime).toLocaleString()}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowList;
