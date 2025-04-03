import axios from "axios";

const API_BASE_URL = "http://localhost:5267/api/attendees";

export const getAttendeesByEvent = async (eventId, token) => {
  return axios.get(`${API_BASE_URL}/event/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addAttendee = async (attendeeData, token) => {
  return axios.post(API_BASE_URL, attendeeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteAttendee = async (attendeeId, token) => {
  return axios.delete(`${API_BASE_URL}/${attendeeId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};