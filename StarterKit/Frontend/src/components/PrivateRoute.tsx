import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode;  
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await fetch('http://localhost:5097/api/v1/login/check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.isLoggedIn) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
