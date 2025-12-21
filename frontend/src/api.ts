import axios from 'axios'

const api = axios.create({ //this creates an axios instance. You can now use this instance in other components, and when you use this instance
//it will use the baseURL as the starting URL. 
  baseURL: 'http://localhost:8000',// your backend base URL
  timeout: 5000,
  headers: { //this tells the backend that you are sending JSON
    'Content-Type': 'application/json',
  },
});

export default api;