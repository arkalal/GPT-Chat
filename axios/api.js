import axios from "axios";
import { baseUrlProd, baseUrlTest } from "./baseUrl";

const instance = axios.create({
  baseURL: `${baseUrlProd}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
