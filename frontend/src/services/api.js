import axios from "axios";
import adress from "./config";

const api = axios.create({
  baseURL: adress,
});

export default api;
