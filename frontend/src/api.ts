import axios from 'axios'

const api = axios.create({ //this creates an axios instance. You can now use this instance in other components, and when you use this instance
//it will use the baseURL as the starting URL. 
  baseURL: 'http://localhost:8000',// your backend base URL
  timeout: 5000,
  headers: { //this tells the backend that you are sending JSON
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => { //This runs before every request and checks localStorage for a token to attach to request
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default api;