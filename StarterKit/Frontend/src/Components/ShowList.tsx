import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export interface Show {
  id: number;
  name: string;
  date: string;
  description: string;
  venue: string;
  price: number;
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
        const response = await axios.get("api/v1/theatreshow/shows");
        const rawData = response.data;

        // Transform the data
        const transformedShows: Show[] = rawData.$values.map((item: any) => {
          const futureDates = item.futureDates.$values; // Extract future dates
          return futureDates.map((date: string) => ({
            id: item.theatreShowId,
            name: item.title,
            date,
            description: item.description,
            venue: item.venue, // Assuming venue data is available
            price: item.price, // Assuming price data is available
          }));
        }).flat(); // Flatten the array if multiple dates exist per show

        // Extract unique venues
        const extractedVenues = [
          ...new Set(transformedShows.map((show) => show.venue)),
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
    .filter((show) => (selectedVenue ? show.venue === selectedVenue : true))
    .filter((show) => {
      if (!selectedMonth) return true;
      const showMonth = new Date(show.date).getMonth() + 1;
      return parseInt(selectedMonth) === showMonth;
    })
    .sort((a, b) => {
      if (sortOption === "A-Z") return a.name.localeCompare(b.name);
      if (sortOption === "Z-A") return b.name.localeCompare(a.name);
      if (sortOption === "price-lowest") return a.price - b.price;
      if (sortOption === "price-highest") return b.price - a.price;
      if (sortOption === "date-ascending")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOption === "date-descending")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0;
    });

  if (loading) {
    return <p>Loading shows...</p>;
  }

  return (
    <div>
      <div>
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
      <ul>
        {filteredShows.map((show) => (
          <li key={`${show.id}-${show.date}`}>
            <Link to={`/shows/${show.id}`}>
              {show.name} - {new Date(show.date).toLocaleString()} - {show.venue} - ${show.price.toFixed(2)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowList;
