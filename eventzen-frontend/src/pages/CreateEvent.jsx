import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CreateEvent() {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5267/api/events", eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event Created Successfully!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Error creating event:", error.response?.data || error.message);
      alert("Failed to create event. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center py-5">
      <h2 className="fw-bold">Create Event</h2>
      <form onSubmit={handleSubmit} className="w-50 p-4 shadow-lg bg-white rounded">
        <div className="mb-3">
          <label className="form-label">Event Title</label>
          <input type="text" name="title" className="form-control" value={eventData.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={eventData.description} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" name="location" className="form-control" value={eventData.location} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input type="date" name="startDate" className="form-control" value={eventData.startDate} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input type="date" name="endDate" className="form-control" value={eventData.endDate} onChange={handleChange} required />
        </div>
        

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
