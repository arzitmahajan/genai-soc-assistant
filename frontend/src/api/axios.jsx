import axios from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL  || 'http://localhost:4000',
    withCredentials: true, // send cookies (HttpOnly cookies recommended)
    headers: {
        'Accept': 'application/json',
    }
});


// Basic interceptor template (refresh token logic should be implemented server-side or via refresh endpoint)
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // call refresh token endpoint - server should set new HttpOnly cookie
                await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
                return api(originalRequest);
            } catch (refreshErr) {
                // redirect to login or dispatch logout
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
);



export default api;