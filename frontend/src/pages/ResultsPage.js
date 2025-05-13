// src/pages/ResultsPage.js
import React, { useEffect, useState } from 'react';
import { Typography, Box, Container } from '@mui/material';
import { fetchUserResults } from '../api/auth';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResults = async () => {
      const response = await fetchUserResults();
      if (response.error) {
        setError(response.error);
      } else {
        setResults(response.results);
      }
    };
    loadResults();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Twoje wyniki
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {results.length > 0 ? (
          results.map((result, index) => {
            const percentage = Math.round((result.score / 30) * 100);
            return (
              <Typography key={index} variant="body1">
                {result.score} punktów / 30 ({percentage}%) - {new Date(result.date).toLocaleDateString()}
              </Typography>
            );
          })
        ) : (
          <Typography variant="body1">
            Nie masz jeszcze zapisanych wyników. Wykonaj test, aby zacząć!
          </Typography>
        )}
      </Box>
    </Container>
  );
}
