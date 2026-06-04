import axios from "axios";
export const baseURL = "http://localhost:3000/api";
export const getData = (url, config = {}) =>
  axios.get(`${baseURL}${url}`, config);
export const postData = (url, data, config = {}) =>
  axios.post(`${baseURL}${url}`, data, config);
export const updateData = (url, data, config = {}) =>
  axios.patch(`${baseURL}${url}`, data, config);
export const deleteData = (url, config = {}) => axios.delete(`${baseURL}${url}`, config);
