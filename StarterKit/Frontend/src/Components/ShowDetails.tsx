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
  const [reservationDetails, setReservationDetails] = useState({
    AmountOfTickets: 1,
    TheatreShowDate: null as string | null,
  });

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/theatreshow?id=${id}`);
        const data = response.data;

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

  const handleDateSelect = (date: string) => {
    setReservationDetails({ ...reservationDetails, TheatreShowDate: date });
  };

  const handleReserveTickets = async () => {
    if (show && reservationDetails.TheatreShowDate) {
      try {
        const response = await axios.post("http://localhost:5097/api/reservation/create", [
          {
            AmountOfTickets: reservationDetails.AmountOfTickets,
            Customer: {
              CustomerId: 101,
              Name: "John Doe",
              Email: "john.doe@example.com"
            },
            TheatreShowDate: {
              DateAndTime: reservationDetails.TheatreShowDate,
              TheatreShow: {
                Title: show.title,
                Venue: {
                  Name: show.venueName,
                  Capacity: 500
                }
              }
            }
          }
        ]);
        console.log("Reservation successful:", response.data);
        navigate("/confirmation"); // Navigate to a confirmation page or another route
      } catch (error) {
        console.error("Error making reservation:", error);
      }
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
      {reservationDetails.TheatreShowDate && (
        <p><strong>Selected Date:</strong> {new Date(reservationDetails.TheatreShowDate).toLocaleString()}</p>
      )}
      <button onClick={handleReserveTickets} disabled={!reservationDetails.TheatreShowDate}>
        Reserve Tickets
      </button>
    </div>
  );
};

export default ShowDetails;
