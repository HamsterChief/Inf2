import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./ShowDetails.css";

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
  const navigate = useNavigate();
  const [reservationDetails, setReservationDetails] = useState({
    AmountOfTickets: 1,
    TheatreShowDate: null as string | null,
  });

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/theatreshow?id=${id}`);
        const data = response.data;

        // Transform the received data
        const futureDates = data.theatreShowDates?.map(
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

    // Navigate to ReservationForm page with the showId and selected date as query params
    navigate(`/reservation-form?showId=${show?.theatreShowId}&date=${date}`);
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

export default ShowDetailsPage;
