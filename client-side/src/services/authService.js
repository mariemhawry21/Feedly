import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export const login = (data) => axios.post(`${API}/users/login`, data);
export const register = (data) => axios.post(`${API}/users/register`, data);

export const getUser = async (userId) => {
  return axios.get(`${API}/users/${userId}`);
};
export const getUserProfile = async (userId) => {
  return axios.get(`${API}/users/${userId}`);
};

export const updateUserProfile = async (userId, data) => {
  return axios.put(`${API}/users/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Or get from your auth context
    },
  });
};