// src/pages/TestPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { saveTestResult } from '../api/auth';

export default function TestPage() {
  const navigate = useNavigate();
  const [questionsPool, setQuestionsPool] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  
  useEffect(() => {
    fetch('/bazapytan.json')
      .then((res) => res.json())
      .then((data) => {
        setQuestionsPool(data);
        
        const shuffled = data.sort(() => 0.5 - Math.random());
        setSelectedQuestions(shuffled.slice(0, 30));
      })
      .catch((err) => console.error('Błąd ładowania pytań:', err));
  }, []);

  if (selectedQuestions.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h5">Ładowanie pytań...</Typography>
      </Container>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };


  const getCEFRLevel = (score) => {
    const percentage = (score / 30) * 100;
    if (percentage < 40) return 'A1';
    else if (percentage < 50) return 'A2';
    else if (percentage < 60) return 'B1';
    else if (percentage < 70) return 'B2';
    else if (percentage < 85) return 'C1';
    else return 'C2';
  };

  const handleSubmit = async () => {
    let correct = 0;
    selectedQuestions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
    
    if (localStorage.getItem('token')) {
      const response = await saveTestResult(correct);
      if (response.error) {
        console.error('Błąd zapisywania wyniku:', response.error);
      } else {
        console.log('Wynik zapisany pomyślnie');
      }
    }
  };

  const handleRestart = () => {
    
    const shuffled = questionsPool.sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 30));
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const percentage = Math.round((score / 30) * 100);
  const cefrLevel = getCEFRLevel(score);
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {!submitted ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Test z angielskiego (Pytanie {currentQuestionIndex + 1} z {selectedQuestions.length})
          </Typography>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </FormLabel>
                <RadioGroup
                  value={answers[currentQuestionIndex] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                >
                  {Object.entries(currentQuestion.options).map(([optionKey, optionValue]) => (
                    <FormControlLabel
                      key={optionKey}
                      value={optionKey}
                      control={<Radio />}
                      label={`${optionKey}: ${optionValue}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
              Poprzednie
            </Button>
            {currentQuestionIndex === selectedQuestions.length - 1 ? (
              <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!answers[currentQuestionIndex]}>
                Zakończ test
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext} disabled={!answers[currentQuestionIndex]}>
                Następne
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Twój wynik: {score} / 30 ({percentage}%)
          </Typography>
          <Typography variant="h5" align="center" gutterBottom>
            Twój poziom: {cefrLevel}
          </Typography>
          {isLoggedIn && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Przegląd odpowiedzi
              </Typography>
              {selectedQuestions.map((q, index) => (
                <Box key={q.id} sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
                  <Typography variant="body1">
                    <strong>{index + 1}. {q.question}</strong>
                  </Typography>
                  <Typography variant="body2" color={answers[index] === q.answer ? 'green' : 'red'}>
                    Twoja odpowiedź: {q.options[answers[index]] || 'Brak odpowiedzi'}
                  </Typography>
                  {answers[index] !== q.answer && (
                    <Typography variant="body2" color="green">
                      Poprawna odpowiedź: {q.options[q.answer]}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleRestart}>
              Rozpocznij ponownie
            </Button>
            {isLoggedIn && (
              <Button variant="outlined" color="primary" onClick={() => navigate('/profile')}>
                Mój profil
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}
