import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Simuleer een autorisatiecheck
  const isAdmin = true; // Dit kun je vervangen met een echte controle

  if (!isAdmin) {
    navigate('/');
  }

  return <h1>Welcome to the Admin Dashboard</h1>;
};

export default Dashboard;
  