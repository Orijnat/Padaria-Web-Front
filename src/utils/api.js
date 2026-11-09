import axios from 'axios';
// O back-end fica no próprio Next.js (src/app/api). NEXT_PUBLIC_API_URL só é
// necessário se a API for hospedada em outro endereço.
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
export default api;
