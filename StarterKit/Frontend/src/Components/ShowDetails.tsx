import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface TheatreShowDetails {
  theatreShowId: number;
  title: string;
  description: string;
  price: number;
  venueName: string;
  futureDates: string[];
}

const ShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<TheatreShowDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/theatreshow?id=${id}`);
        const data = response.data;

        const futureDates =
          data.theatreShowDates?.$values.map(
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

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const navigateToReservationForm = () => {
    if (selectedDate && show) {
      navigate(
        `/reservation-form?showId=${show.theatreShowId}&date=${encodeURIComponent(
          selectedDate
        )}`
      );
    }
  };

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
            <li key={index}>
              <button onClick={() => handleDateSelect(date)}>
                {new Date(date).toLocaleString()}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming dates available.</p>
      )}
      {selectedDate && (
        <p><strong>Selected Date:</strong> {new Date(selectedDate).toLocaleString()}</p>
      )}
      <button onClick={navigateToReservationForm} disabled={!selectedDate}>
        Proceed to Reservation
      </button>
    </div>
  );
};

export default ShowDetails;
