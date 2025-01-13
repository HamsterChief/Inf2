import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

interface TheatreShowDetails {
  theatreShowId: number;
  title: string;
  description: string;
  price: number;
  venue: {
    venueId: number;
    name: string;
    capacity: number;
  };
  theatreShowDates: {
    theatreShowDateId: number;
    dateAndTime: string;
  }[];
}

const ReservationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reservationDate = searchParams.get("date");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    amountOfTickets: 1,
  });

  const [showDetails, setShowDetails] = useState<TheatreShowDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const showId = searchParams.get("showId");  // Assuming you pass the showId as a query param
        if (showId) {
          const response = await axios.get(
            `http://localhost:5097/api/v1/theatreshow?id=${showId}`,
            { headers: { "Accept": "application/json" } }
          );
          setShowDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching show details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reservationDate && showDetails) {
      try {
        const selectedShowDate = showDetails.theatreShowDates.find(
          (date) => date.dateAndTime === reservationDate
        );

        if (!selectedShowDate) {
          console.error("Selected date not found in show details");
          return;
        }

        const reservationPayload = {
          AmountOfTickets: formData.amountOfTickets,
          Customer: {
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Email: formData.email,
          },
          TheatreShowDate: {
            TheatreShowDateId: selectedShowDate.theatreShowDateId,  
          },
        };
        

        console.log("Reservation Payload:", JSON.stringify(reservationPayload));

        const response = await axios.post(
          "http://localhost:5097/api/v1/reservation/create",
          reservationPayload
        );
        console.log("Reservation successful:", response.data);
        // Optionally navigate to a confirmation page after successful reservation
        navigate("/");
      } catch (error) {
        console.error("Error making reservation:", error);
      }
    }
  };

  if (loading) {
    return <p>Loading show details...</p>;
  }

  if (!showDetails) {
    return <p>Show not found!</p>;
  }

  return (
    <div>
      <h2>Reservation Form</h2>
      <p>Reservation Date: {new Date(reservationDate || "").toLocaleString()}</p>
      <h3>{showDetails.title}</h3>
      <p>{showDetails.description}</p>
      <p><strong>Price:</strong> ${showDetails.price}</p>
      <p><strong>Venue:</strong> {showDetails.venue.name} (Capacity: {showDetails.venue.capacity})</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Number of Tickets:</label>
          <input
            type="number"
            name="amountOfTickets"
            min="1"
            value={formData.amountOfTickets}
            onChange={(e) => setFormData({ ...formData, amountOfTickets: parseInt(e.target.value, 10) })}
            required
          />
        </div>
        <button type="submit">Confirm Reservation</button>
      </form>
    </div>
  );
};

export default ReservationForm;