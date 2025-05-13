// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Card, CardContent } from '@mui/material';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    const response = await loginUser(username, password);
    if (response.error) {
      setError(response.error);
    } else {
    
      window.dispatchEvent(new Event('authChange'));
      navigate('/profile');
    }
  };

  return (
    <Box sx={{ pt: 4, pb: 2 }}> 
      <Container maxWidth="sm">
        <Card sx={{ p: 4, boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Logowanie
            </Typography>
            {error && (
              <Typography color="error" align="center" mb={2}>
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Nazwa użytkownika"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              label="Hasło"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{
                mt: 2,
                backgroundColor: '#1e3c72',
                '&:hover': { backgroundColor: '#1e3c72' }
              }}
            >
              Zaloguj się
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
