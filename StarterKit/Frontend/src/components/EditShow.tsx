import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditShow.css';

interface Venue {
  venueId: number;
  name: string;
  capacity: number;
}

interface Show {
  id: number;
  title: string;
  description: string;
  price: number;
  venue: Venue;
}

const EditShow: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Haal het ID uit de route-parameters
  const navigate = useNavigate();
  
  // Pas de initialisatie van useState aan met het juiste type Show
  const [show, setShow] = useState<Show>({
    id: 0, // initialiseer met een leeg id
    title: '',
    description: '',
    price: 0,
    venue: {
      venueId: 0,
      name: '',
      capacity: 0,
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShow();
  }, []);

  const fetchShow = async () => {
    // Controleer of er een geldig id is
    if (!id) {
      console.error('Show ID is missing');
      alert('Invalid Show ID');
      navigate('/dashboard'); // Redirect de gebruiker naar het dashboard
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5097/api/v1/theatreshow/${id}`);
      const data = response.data;
  
      const transformedShow: Show = {
        id: data.theatreShowId,
        title: data.title,
        description: data.description,
        price: data.price,
        venue: {
          venueId: data.venue.venueId,
          name: data.venue.name,
          capacity: data.venue.capacity,
        },
      };
  
      setShow(transformedShow);
    } catch (error) {
      console.error('Error fetching show:', error);
      alert('Failed to fetch show data');
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Voor description: zorg ervoor dat de tekst niet langer is dan 100 tekens
    if (name === 'description' && value.length > 150) {
      return; // Voorkom het invoeren van meer dan 100 tekens
    }
    setShow({ ...show, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5097/api/v1/theatreshow/${show.id}`, show);
      console.log(response);
      alert('Show updated successfully!');
      navigate('/dashboard'); // Ga terug naar het dashboard
    } catch (error) {
      console.error('Error updating show:', error);
      alert('Failed to update show.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Show</h1>
      <form>
        <div>
          <label>Title</label>
          <input 
            type="text" 
            name="title" 
            value={show.title} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label>Description</label>
          <textarea 
            name="description" 
            value={show.description} 
            onChange={handleInputChange} 
            maxLength={75}
          />
        </div>
        <div>
          <label>Price</label>
          <input 
            type="number" 
            name="price" 
            value={show.price} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label>Venue</label>
          <input 
            type="text" 
            name="venue" 
            value={show.venue.name} 
            disabled 
          />
        </div>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
      </form>
    </div>
  );
};

export default EditShow;
