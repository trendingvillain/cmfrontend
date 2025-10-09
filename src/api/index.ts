import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adminAPI = {
  login: (data: { username: string; password: string }) => API.post("/admin/login", data),
  addTemple: (data: any) => API.post("/temples", data),
  updateTemple: (id: number, data: any) => API.put(`/temples/${id}`, data),
  deleteTemple: (id: number) => API.delete(`/temples/${id}`),
  addEvent: (data: any) => API.post("/events", data),
  updateEvent: (id: number, data: any) => API.put(`/events/${id}`, data),
  deleteEvent: (id: number) => API.delete(`/events/${id}`),
};

export const templeAPI = {
  getAll: () => API.get("/temples"),
  getById: (id: number) => API.get(`/temples/${id}`),
};

export const eventAPI = {
  getAll: () => API.get("/events"),
  getByTemple: (templeId: number) => API.get(`/events/${templeId}`),
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export default API;
