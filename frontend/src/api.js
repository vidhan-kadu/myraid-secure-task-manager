import axios from "axios";

const API = axios.create({
  baseURL: "https://myraid-backend-o7sl.onrender.com",
  withCredentials: true,
});

export default API;
