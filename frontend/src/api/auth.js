const API_URL = 'http://localhost:5000';

export const registerUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return { error: 'Błąd serwera' };
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
    }
    return data;
  } catch (error) {
    console.error('Błąd logowania:', error);
    return { error: 'Błąd serwera' };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const fetchUserResults = async () => {
  try {
    const token = getAuthToken();
    if (!token) return { error: 'Brak autoryzacji' };

    const response = await fetch(`${API_URL}/test/results`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return await response.json();
  } catch (error) {
    console.error('Błąd pobierania wyników:', error);
    return { error: 'Błąd serwera' };
  }
};

export const saveTestResult = async (score) => {
  try {
    const token = getAuthToken();
    if (!token) return { error: 'Brak autoryzacji' };

    const response = await fetch(`${API_URL}/test/save-result`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ score })
    });

    return await response.json();
  } catch (error) {
    console.error('Błąd zapisywania wyniku:', error);
    return { error: 'Błąd serwera' };
  }
};
