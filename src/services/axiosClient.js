import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.freecurrencyapi.com/v1/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Common methods for API requests
export const get = (url, params = {}) => {
  return axiosClient.get(url, { params });
};

export const post = (url, data) => {
  return axiosClient.post(url, data);
};

export const put = (url, data) => {
  return axiosClient.put(url, data);
};

export const remove = (url) => {
  return axiosClient.delete(url);
};

export default axiosClient;
