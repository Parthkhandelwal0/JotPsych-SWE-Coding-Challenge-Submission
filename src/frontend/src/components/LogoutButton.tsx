import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useAuth } from '../services/AuthContext';
import APIService from '../services/APIService';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Make a request to the backend to invalidate the token
      await APIService.request('/logout', 'POST', null, true);
      
      // Clear the token from AuthContext
      logout();
      
      // Remove the token from localStorage
      localStorage.removeItem('access_token');
      
      // Clear the token from APIService
      APIService.setToken(null);
      
      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;