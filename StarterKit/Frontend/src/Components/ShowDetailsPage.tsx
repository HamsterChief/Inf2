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
        const response = await axios.get<TheatreShowDetails>(`/api/shows/${id}`);
        setShow(response.data);
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
      <ul>
        {show.futureDates.map((date, index) => (
          <li key={index}>{new Date(date).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default ShowDetailsPage;
