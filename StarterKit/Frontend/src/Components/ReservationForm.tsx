import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [formData, setFormData] = useState({
    CustomerId: 1,
    amountOfTickets: 1,
  });

  const [showDetails, setShowDetails] = useState<TheatreShowDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const showId = searchParams.get("showId"); 
        if (showId != null) {
          const response = await axios.get(
            `http://localhost:5097/api/v1/theatreshow?id=${showId}`,
            { headers: { "Accept": "application/json" } }
          );
          const data = response.data;

          const futureDates =
            data.theatreShowDates?.$values.map(
              (dateObj: any) => new Date(dateObj.dateAndTime).toLocaleDateString('en-GB') // Convert to DD/MM/YYYY
            ) || [];

          setShowDetails({
            theatreShowId: data.theatreShowId,
            title: data.title,
            description: data.description,
            price: data.price,
            venue: {
              venueId: data.venue?.venueId || 0,
              name: data.venue?.name || "",
              capacity: data.venue?.capacity || 0,
            },
            theatreShowDates: data.theatreShowDates?.$values || [],
          });
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amountOfTickets" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reservationDate && showDetails) {
      const formattedReservationDate = new Date(reservationDate).toLocaleDateString('en-GB'); // Convert to DD/MM/YYYY
      const selectedDate = showDetails.theatreShowDates.find(
        (d) => new Date(d.dateAndTime).toLocaleDateString('en-GB') === formattedReservationDate
      );

      if (!selectedDate) {
        console.error("Invalid reservation date!");
        return;
      }

      const theatreShowDateId = selectedDate.theatreShowDateId;

      const payload = {
        AmountOfTickets: formData.amountOfTickets,
        Used: false,
        Customer: {
          CustomerId: formData.CustomerId,
        },
        TheatreShowDate: {
          TheatreShowDateId: theatreShowDateId,
        },
      };

      console.log("Reservation Payload:", payload);
      alert("Reservation Payload:\n" + JSON.stringify(payload, null, 2));

      try {
        const response = await axios.post(
          "http://localhost:5097/api/reservation/create",
          payload
        );
        console.log("Reservation successful:", response.data);
        alert("Reservation confirmed!");
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
      <p>Reservation Date: {reservationDate && new Date(reservationDate).toLocaleString('en-GB')}</p> {/* Display date in DD/MM/YYYY format */}
      <h3>{showDetails.title}</h3>
      <p>{showDetails.description}</p>
      <p>
        <strong>Price:</strong> ${showDetails.price}
      </p>
      <p>
        <strong>Venue:</strong> {showDetails.venue.name} (Capacity:{" "}
        {showDetails.venue.capacity})
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer ID:</label>
          <input
            type="number"
            name="CustomerId"
            value={formData.CustomerId}
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
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={!reservationDate}>Confirm Reservation</button>
      </form>
    </div>
  );
};

export default ReservationForm;
