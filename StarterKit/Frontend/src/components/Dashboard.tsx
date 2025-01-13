import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';

interface Customer {
  id: number;
  name: string;
}

interface Venue {
  venueId: number;
  name: string;
  capacity: number;
  theatredates: Show[];
}

interface Show {
  id: number;
  title: string;
  description: string;
  price: number;
  venue: Venue;
  date?: string; // Voeg de datum van de voorstelling toe (optioneel)
}

interface Reservation {
  id: number;
  amountOfTickets: number;
  used: boolean;
  show: Show; // Voeg de show property toe die naar een Show verwijst
  customerName: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();
  const [newShow, setNewShow] = useState<Show>({
    id: 0,
    title: '',
    description: '',
    price: 0,
    venue: { venueId: 0, name: '', capacity: 0, theatredates: [] },
  });

  useEffect(() => {
    fetchShows();
    fetchVenues();
    fetchReservations();
  }, []);

  const fetchShows = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5097/api/v1/theatreshow/all');
      const jsonData = response.data;

      console.log("Fetched shows: ", jsonData);

      const transformedShows: Show[] = jsonData.map((item: any) => ({
        id: item.theatreShowId,
        title: item.title,
        description: item.description,
        price: item.price,
        venue: item.venue || { venueId: 0, name: 'Unknown Venue', capacity: 0, theatredates: [] },
      }));

      setShows(transformedShows);
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await axios.get('http://localhost:5097/api/v1/venue/all');
      const transformedVenues: Venue[] = response.data.map((venue: any) => ({
        venueId: venue.venueId,
        name: venue.name,
        capacity: venue.capacity,
        theatredates: venue.theatredates?.$values || [],
      }));
      setVenues(transformedVenues);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5097/api/v1/reservation/all');
      console.log("Fetched reservations: ", response.data);
    
      const showsResponse = await axios.get('http://localhost:5097/api/v1/theatreshow/all');
      const showsData = showsResponse.data;
    
      const transformedReservations: Reservation[] = response.data.map((item: any) => {
        const show = showsData.find((show: any) => show.id === item.showId);
        
        const customer = item.customer;
        
        // Controleer de aanwezigheid van theatreShowDate en de datum
        const showDate = item.theatreShowDate?.dateAndTime
          ? new Date(item.theatreShowDate.dateAndTime).toLocaleString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })
          : 'Unknown date';
  
        console.log("Show Date: ", showDate);  // Debug log voor showDate
  
        return {
          id: item.reservationId,
          amountOfTickets: item.amountOfTickets,
          used: item.used,
          show: show || { title: 'Unknown Show', description: '', price: 0, venue: { name: 'Unknown Venue', capacity: 0 } },
          customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown',
          date: showDate,  // Gebruik de datum van de voorstelling
        };
      });
  
      setReservations(transformedReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };
  



  
  

  // const fetchCustomers = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5097/api/v1/customer');
  //     console.log("Fetched customers: ", response.data);
  
  //     const transformedCustomers: Customer[] = response.data.map((customer: any) => ({
  //       id: customer.CustomerId,
  //       name: customer.FirstName,
  //     }));

  //     console.log("Customername: ", transformedCustomers[0].name);
      
  //     setCustomers(transformedCustomers);
  //   } catch (error) {
  //     console.error('Error fetching customers:', error);
  //   }
  // };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'venueId') {
      const selectedVenue = venues.find((venue) => venue.venueId === Number(value));
      if (selectedVenue) {
        setNewShow({ ...newShow, venue: selectedVenue });
      }
    } else {
      setNewShow({ ...newShow, [name]: name === 'price' ? Number(value) : value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const payload = {
        title: newShow.title,
        description: newShow.description,
        price: newShow.price,
        venue: { venueId: newShow.venue.venueId }
      };
  
      const response = await axios.post('http://localhost:5097/api/v1/theatreshow/create', payload);

      fetchShows();
  
      const createdShow = response.data;
  
      setShows((prevShows) => [
        ...prevShows,
        {
          ...createdShow,
          venue: newShow.venue,
        },
      ]);
  
      alert('New show added successfully!');
      setNewShow({
        id: 0,
        title: '',
        description: '',
        price: 0,
        venue: { venueId: 0, name: '', capacity: 0, theatredates: [] }
      });

      console.log("Created show: ", createdShow)
    } catch (error) {
      console.error("Error adding show:", error);
      alert('Failed to add new show');
    }
  };

  const deleteShow = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        const response = await fetch(`http://localhost:5097/api/v1/theatreshow/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Show deleted successfully');
          setShows(shows.filter((show) => show.id !== id));
        } else {
          alert('Failed to delete the show');
        }
      } catch (error) {
        console.error('Error deleting show:', error);
        alert('Error deleting show');
      }
    }
  };

  const filterReservations = (term: string) => {
    return reservations.filter((reservation) =>
      reservation.customerName.toLowerCase().includes(term.toLowerCase()) ||
      reservation.show.title.toLowerCase().includes(term.toLowerCase())
    );
  };

  const truncateDescription = (description: string | undefined, maxLength: number = 100) => {
    if (!description) {
      return 'No description available';
    }
    return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
  
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="dashboard-content">
          <div className="grid-container">
            <div className="form-container">
              <h2>Add New Show</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newShow.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newShow.description}
                    onChange={handleInputChange}
                    required
                    maxLength={75}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newShow.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Venue</label>
                  <select
                    name="venueId"
                    value={newShow.venue.venueId}
                    onChange={handleInputChange}
                    required={venues.length > 0}
                  >
                    {venues.length > 0 ? (
                      <>
                        <option value="">Select a venue</option>
                        {venues.map((venue) => (
                          <option key={venue.venueId} value={venue.venueId}>
                            {venue.name}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="">No venues available</option>
                    )}
                  </select>
                </div>
                <button type="submit">Add Show</button>
              </form>
            </div>
  
            {/* Shows Table */}
            <div className="table-container">
              <h2>Shows</h2>
              <table className="show-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Venue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.length > 0 ? (
                    shows.map((show, index) => (
                      <tr key={show.id}>
                        <td>{index + 1}</td>
                        <td>{show.title}</td>
                        <td className="show-description">{truncateDescription(show.description)}</td>
                        <td>{show.price}</td>
                        <td>{show.venue?.name || 'N/A'}</td>
                        <td>
                          <button className="edit-button" onClick={() => navigate(`/show/edit/${show.id}`)}>Edit</button>
                          <button className="delete-button" onClick={() => deleteShow(show.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center' }}>No shows available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Search Input and Reservations Table */}
          <div className="reservation-container">
            <div className="table-container">
              <h2>Reservations</h2>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search reservations"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
  
              <table className="reservation-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer Name</th>
                    <th>Theatre Show Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filterReservations(searchTerm).length > 0 ? (
                    filterReservations(searchTerm).map((reservation, index) => (
                      <tr key={reservation.id}>
                        <td>{index + 1}</td>
                        <td>{reservation.customerName || 'Unknown'}</td>
                        <td>{reservation.date || 'No show date'}</td>
                        <td>{reservation.used ? 'Used' : 'Not Used'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center' }}>No reservations available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  
};

export default Dashboard;
