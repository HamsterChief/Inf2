import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface TheatreShowDetails {
  theatreShowId: number;
  title: string;
  description: string;
  price: number;
  venueName: string;
  futureDates: string[];
}

const ShowDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<TheatreShowDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/theatreshow?id=${id}`);
        const data = response.data;

        // Transform the received data
        const futureDates = data.theatreShowDates?.$values.map(
          (dateObj: any) => dateObj.dateAndTime
        ) || [];

        setShow({
          theatreShowId: data.theatreShowId,
          title: data.title,
          description: data.description,
          price: data.price,
          venueName: data.venue?.name || "Unknown Venue",
          futureDates,
        });
      } catch (error) {
        console.error("Error fetching show details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  if (loading) {
    return <p>Loading show details...</p>;
  }

  if (!show) {
    return <p>Show not found!</p>;
  }

  return (
    <div>
      <h1>{show.title}</h1>
      <p>{show.description}</p>
      <p><strong>Price:</strong> ${show.price}</p>
      <p><strong>Venue:</strong> {show.venueName}</p>
      <p><strong>Upcoming Dates:</strong></p>
      {show.futureDates.length > 0 ? (
        <ul>
          {show.futureDates.map((date, index) => (
            <li key={index}>{new Date(date).toLocaleString()}</li>
          ))}
        </ul>
      ) : (
        <p>No upcoming dates available.</p>
      )}
    </div>
  );
};

export default ShowDetailsPage;
