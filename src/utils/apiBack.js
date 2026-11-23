import axios from 'axios';
// API do back-end (Express + PostgreSQL), usada por funcionários.
// Se a API estiver em outro endereço, defina NEXT_PUBLIC_BACK_URL no .env.local.
const apiBack = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
export default apiBack;
