import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, CircularProgress, Avatar, Button } from '@mui/material';
import AudioRecorder from './AudioRecorder';
import APIService from '../services/APIService';

const Profile = () => {
  const [username, setUsername] = useState<string>('');
  const [motto, setMotto] = useState<string>('My motto goes here!');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');

      if (token) {
        try {
          const response = await APIService.request('/user', 'GET', null, true);
          setUsername(response.username);
          setMotto(response.motto);
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate('/login'); // Redirect to login page if not authenticated
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await APIService.request('/logout', 'POST', null, true);
      localStorage.removeItem('access_token');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 3,
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              width: '100%',
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h5" gutterBottom>
              {username}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {motto}
            </Typography>
            <AudioRecorder />
            <Box
              display="flex"
              justifyContent="space-between"
              mt={4}
              width="100%"
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  // Optional: refresh profile data after recording new motto
                  window.location.reload();
                }}
              >
                Record (New) Motto
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
