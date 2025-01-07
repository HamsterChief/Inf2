import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export interface Show {
  id: number;
  name: string;
  date: string;
  description: string;
}

const ShowList: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

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
          }));
        }).flat(); // Flatten the array if multiple dates exist per show
  
        setShows(transformedShows);
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchShows();
  }, []);

  if (loading) {
    return <p>Loading shows...</p>;
  }

  return (
    <ul>
      {shows.map((show) => (
        <li key={`${show.id}-${show.date}`}>
          <Link to={`/shows/${show.id}`}>
            {show.name} - {new Date(show.date).toLocaleString()}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ShowList;
