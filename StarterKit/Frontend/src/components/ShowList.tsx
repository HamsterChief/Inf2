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
  };
  price: number;
  ticketsReserved: number; // Aantal tickets gereserveerd
  theatreShowDates: {
    theatreShowDateId: number;
    dateAndTime: string;
  }[];
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
    const fetchShowsAndReservations = async () => {
      try {
        const showsResponse = await axios.get("api/v1/theatreshow/all");
        const reservationsResponse = await axios.get("api/v1/reservation/all");
  
        const rawShows = showsResponse.data;
        // Zorg ervoor dat reservations altijd een array is
        const reservations = Array.isArray(reservationsResponse.data)
        ? reservationsResponse.data
        : [];
  
        console.log("Fetched reservations:", reservations);
  
        const transformedShows: Show[] = rawShows.map((item: any) => ({
          id: item.theatreShowId,
          name: item.title,
          description: item.description,
          price: item.price,
          ticketsReserved: 0, // Start altijd met 0 gereserveerde tickets
          venue: {
            venueId: item.venueId,
            name: item.venue.name,
            capacity: item.venue.capacity,
          },
          theatreShowDates: item.theatreShowDates?.map((date: any) => ({
            theatreShowDateId: date.theatreShowDateId,
            dateAndTime: date.dateAndTime,
          })) || [],
        }));
        
        // Bereken het aantal tickets per show
        reservations.forEach((reservation: any) => {
          const theatreShowDateId = reservation.theatreShowDate.theatreShowDateId;

          // Vind de juiste show en voeg de tickets toe
          const matchingShow = transformedShows.find((show) =>
            show.theatreShowDates.some((date) => date.theatreShowDateId === theatreShowDateId)
          );
        
          if (matchingShow) {
            matchingShow.ticketsReserved += reservation.amountOfTickets;
            console.log(`Added ${reservation.amountOfTickets} tickets to show ID: ${matchingShow.id}`);
          } else {
            console.log(`No matching show found for reservation with theatreShowDateId: ${theatreShowDateId}`);
          }
        });
        
        console.log("Final shows with tickets reserved:", transformedShows);
        
        setShows(transformedShows);

        const extractedVenues = [
          ...new Set(transformedShows.map((show) => show.venue.name)),
        ];
        setVenues(extractedVenues);
      } catch (error) {
        console.error("Error fetching shows or reservations:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchShowsAndReservations();
  }, []);

  const mostPopularShow = shows.reduce(
    (max, show) => (show.ticketsReserved > max.ticketsReserved ? show : max),
    shows[0] // Start met de eerste show
  );
  

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
      if (sortOption === "popularity")
        return b.ticketsReserved - a.ticketsReserved; // Sorteer op ticketsReserved (hoog naar laag)
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
          <option value="popularity">Popularity</option>
        </select>
      </div>

      {/* Shows list section */}
      <ul className="show-list">
        {filteredShows.map((show) => (
          <li key={show.id} className="show-item">
            <Link to={`/shows/${show.id}`} className="show-link">
              <h3>{show.name}
                {show.id === mostPopularShow.id && (
                    <span className="most-popular-label">Most Popular Show</span>
                )}
              </h3>
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
