import axios from "axios";

const api = axios.create({
  baseURL: "/api", // como está no mesmo repositório
});

export default api;
