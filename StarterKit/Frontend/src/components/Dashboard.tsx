import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';

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
}

const Dashboard: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
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
  
      // Maak een POST request om de show aan te maken
      const response = await axios.post('http://localhost:5097/api/v1/theatreshow/create', payload);

      fetchShows();
  
      // De server zou de gemaakte show terugsturen, inclusief het theatreShowId
      const createdShow = response.data;  // Verkrijg de nieuwe show met ID en andere details
  
      // Voeg de nieuwe show toe aan de lijst van bestaande shows
      setShows((prevShows) => [
        ...prevShows,
        {
          ...createdShow, // Nieuwe show met ID en venue
          venue: newShow.venue,  // Venue gegevens blijven intact
        },
      ]);
  
      // Reset het formulier na succesvol toevoegen
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

          {shows.length > 0 ? (
            <div className="table-container">
              <table className="show-table">
                <thead>
                  <tr>
                    <th>#</th> {/* Nieuwe kolom voor volgorde */}
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Venue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.map((show, index) => ( // Gebruik index als volgnummer
                      <tr key={show.id}>
                        <td>{index + 1}</td> {/* Volgnummer (1-gebaseerd) */}
                        <td>{show.title}</td>
                        <td className="show-description">{truncateDescription(show.description)}</td>
                        <td>{show.price}</td>
                        <td>{show.venue?.name || 'N/A'}</td>
                        <td>
                          <button className="edit-button" onClick={() => navigate(`/show/edit/${show.id}`)}>Edit</button>
                          <button className="delete-button" onClick={() => deleteShow(show.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No shows in database</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;