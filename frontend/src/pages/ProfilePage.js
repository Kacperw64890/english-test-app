// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchUserResults } from '../api/auth';

export default function ProfilePage() {
  const [results, setResults] = useState([]);
  const [resultsError, setResultsError] = useState('');
  const navigate = useNavigate();

  // Funkcja określająca poziom CEFR na podstawie wyniku (dla testu z 30 pytań)
  const getCEFRLevel = (score) => {
    const percentage = (score / 30) * 100;
    if (percentage < 40) return 'A1';
    else if (percentage < 50) return 'A2';
    else if (percentage < 60) return 'B1';
    else if (percentage < 70) return 'B2';
    else if (percentage < 85) return 'C1';
    else return 'C2';
  };

  useEffect(() => {
    const loadResults = async () => {
      const response = await fetchUserResults();
      if (response.error) {
        setResultsError(response.error);
      } else {
        setResults(response.results);
      }
    };
    loadResults();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Nagłówek profilu */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Twój profil
        </Typography>
        <Typography variant="body1">
          Witaj, {localStorage.getItem('username') || 'Użytkowniku'}!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/test')}
        >
          Rozpocznij test
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Historia testów */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Historia testów
        </Typography>
        {resultsError && <Typography color="error">{resultsError}</Typography>}
        {results.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Lp.</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Wynik</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Procent</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Poziom</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => {
                  const percentage = Math.round((result.score / 30) * 100);
                  const level = getCEFRLevel(result.score);
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="center">{result.score} / 30</TableCell>
                      <TableCell align="center">{percentage}%</TableCell>
                      <TableCell align="center">{level}</TableCell>
                      <TableCell align="center">
                        {new Date(result.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Nie masz jeszcze zapisanych wyników.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
