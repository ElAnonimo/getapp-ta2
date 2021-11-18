import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;

const conf: AxiosRequestConfig = {
  baseURL: API_URL
};

const api: AxiosInstance = axios.create(conf);

api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config) {
    config = {};
  }
  if (!config.headers) {
    config.headers = {};
  }
  config.headers.authorization = API_KEY || "";
  return config;
});

export default api;
