// src/pages/HomePage.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openTestOptions, setOpenTestOptions] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const handleStartTestClick = () => {
    if (isLoggedIn) {
      navigate('/test');
    } else {
      setOpenTestOptions(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenTestOptions(false);
  };

  const handleOptionClick = (option) => {
  
    if (option === 'login') {
      navigate('/login');
    } else if (option === 'register') {
      navigate('/register');
    } else if (option === 'guest') {
      navigate('/test');
    }
    setOpenTestOptions(false);
  };

  return (
    <Box>
      {/* Sekcja Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 6 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Witaj w EnglishLevel
          </Typography>
          <Typography variant="h6" mb={4}>
            Sprawdź swoje umiejętności angielskiego w kilka minut.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleStartTestClick}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: '8px'
            }}
          >
            Rozpocznij test
          </Button>
        </Container>
      </Box>

      {/* Modal z opcjami dla niezalogowanych */}
      <Dialog open={openTestOptions} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle>Opcje testu</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Aby rozpocząć test, możesz się zalogować lub zarejestrować.
            Jeśli nie chcesz zakładać konta, wybierz opcję "Rozpocznij test jako gość".
          </Typography>
        </DialogContent>
        <DialogActions>
          <Stack direction="column" spacing={2} sx={{ width: '100%', p: 2 }}>
            <Button variant="contained" color="primary" fullWidth onClick={() => handleOptionClick('login')}>
              Zaloguj się
            </Button>
            <Button variant="contained" color="primary" fullWidth onClick={() => handleOptionClick('register')}>
              Zarejestruj
            </Button>
            <Button variant="outlined" color="primary" fullWidth onClick={() => handleOptionClick('guest')}>
              Rozpocznij test jako gość
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Sekcja z cechami */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
              Dlaczego warto nas wybrać?
            </Typography>
            <Typography variant="subtitle1" textAlign="center" color="text.secondary" mb={4}>
              Dostarczamy nowoczesne narzędzia do oceny i poprawy Twojego poziomu angielskiego.
            </Typography>
          </Grid>
          {[
            {
              title: 'Dokładna ocena',
              description: 'Uzyskaj szczegółową analizę swojego poziomu angielskiego.',
              icon: 'D'
            },
            {
              title: 'Łatwy w użyciu',
              description: 'Prosty i intuicyjny interfejs zaprojektowany dla każdego.',
              icon: 'Ł'
            },
            {
              title: 'Szybkie wyniki',
              description: 'Otrzymaj wyniki testu natychmiast i zacznij się rozwijać.',
              icon: 'S'
            }
          ].map((feature, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: 'center', px: 3, py: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem'
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Sekcja opinii użytkowników */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
            Co mówią nasi użytkownicy?
          </Typography>
          <Grid container spacing={4} justifyContent="center" mt={2}>
            {[
              { name: 'Anna K.', review: 'Świetny test! Bardzo precyzyjny.', avatar: 'A' },
              { name: 'Marcin P.', review: 'Pomógł mi określić mój poziom angielskiego.', avatar: 'M' },
              { name: 'Karolina L.', review: 'Szybki i intuicyjny test, gorąco polecam!', avatar: 'K' }
            ].map((user, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    p: 2,
                    boxShadow: 3,
                    borderRadius: '12px',
                    minHeight: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 56,
                        height: 56,
                        fontSize: '1.5rem',
                        mx: 'auto'
                      }}
                    >
                      {user.avatar}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" mt={2}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {user.review}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
