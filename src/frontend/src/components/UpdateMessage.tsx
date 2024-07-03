import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import APIService from '../services/APIService';

const UpdateMessage: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        await APIService.request('/check', 'GET');
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Please update your client application to the latest version.') {
          setMessage(error.message);
          APIService.updateAppVersion('1.2.1'); // Simulate app update
        } else {
          console.error('Unexpected error:', error);
        }
      }
    };

    checkForUpdate();
  }, []);

  if (message) {
    return (
      <Container maxWidth="xs">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          textAlign="center"
        >
          <Typography variant="h6" color="error">
            {message}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()} // Reload the app to simulate an update
            sx={{ mt: 2 }}
          >
            Reload
          </Button>
        </Box>
      </Container>
    );
  }

  return null;
};

export default UpdateMessage;
