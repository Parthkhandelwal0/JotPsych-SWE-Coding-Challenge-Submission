import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, CircularProgress } from '@mui/material';
import APIService from '../services/APIService';

function Register() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [profilePicUrl, setProfilePicUrl] = useState<string>('');
  const [motto, setMotto] = useState<string>('');  // Added motto state
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await APIService.request('/register', 'POST', { username, password, name, bio, profile_pic_url: profilePicUrl, motto });
      localStorage.setItem('access_token', response.access_token);
      APIService.setToken(response.access_token);
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      setMessage('Registration failed');
      console.error('Error during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            margin="normal"
            fullWidth
            multiline
          />
          <TextField
            label="Profile Picture URL"
            value={profilePicUrl}
            onChange={(e) => setProfilePicUrl(e.target.value)}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Motto"
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
            margin="normal"
            fullWidth
          />  {/* Added motto input */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Box>
        {message && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Register;
