import axios from 'axios';

// Cliente HTTP configurado para se comunicar com a API backend (padariaApi)
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
