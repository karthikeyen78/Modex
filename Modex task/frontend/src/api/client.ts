import axios from 'axios';

// Get base URL from env or default to localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default client;
