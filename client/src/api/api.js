import axios from "axios";

const api = axios.create({
  // baseURL: "https://novuestyle.com/api",
  // baseURL: "http://localhost:8000/api",
  baseURL: "/api",
   withCredentials: true,
});

export default api;
