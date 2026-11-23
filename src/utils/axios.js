import api from './api';
export const CHAVE_TOKEN = 'padaria-token';
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(CHAVE_TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Desfaz o envelope da API ({ success, data?, message?, error? }) para que os
// call sites consumam `res.data` diretamente, como antes.
api.interceptors.response.use((response) => {
    const payload = response?.data;
    if (payload && typeof payload === 'object' && payload.success === true) {
        response.data = 'data' in payload ? payload.data : payload;
    }
    return response;
}, (error) => {
    return Promise.reject(error);
});
export default api;
