// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import ProfilePage from './pages/ProfilePage.js';
import ResultsPage from './pages/ResultsPage.js';
import TestPage from './pages/TestPage.js';
import { getAuthToken, logoutUser } from './api/auth.js';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthToken());
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!getAuthToken());
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    navigate("/");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        EnglishLevel
      </Typography>
      <List>
        {isLoggedIn ? (
          <>
            <ListItem button component={Link} to="/profile">
              <ListItemText primary="Mój Profil" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Wyloguj się" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Logowanie" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="Rejestracja" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Nagłówek */}
      <AppBar position="sticky" color="primary" sx={{ boxShadow: 3, py: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" fontWeight="bold">
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              EnglishLevel
            </Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/profile" sx={{ mx: 1, fontSize: '1rem' }}>
                  Mój Profil
                </Button>
                <Button color="inherit" onClick={handleLogout} sx={{ mx: 1, fontSize: '1rem' }}>
                  Wyloguj się
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" sx={{ mx: 1, fontSize: '1rem' }}>
                  Logowanie
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  variant="outlined"
                  sx={{ borderColor: 'white', color: 'white', fontSize: '1rem' }}
                >
                  Rejestracja
                </Button>
              </>
            )}
          </Box>
          <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menu boczne (tylko na mobilnych) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Główna zawartość */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </Container>

      {/* Stopka */}
      <Box
        component="footer"
        sx={{
          py: 4,
          backgroundColor: '#eeeeee',
          textAlign: 'center',
          mt: 'auto',
          boxShadow: 2
        }}
      >
        <Typography variant="body1" fontWeight="bold" color="text.primary">
          © 2025 EnglishLevel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Link to="/privacy" style={{ textDecoration: 'none', color: '#1565c0', marginRight: 10 }}>
            Polityka prywatności
          </Link>
          |
          <Link to="/contact" style={{ textDecoration: 'none', color: '#1565c0', marginLeft: 10 }}>
            Kontakt
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
