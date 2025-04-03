import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";

function RegisterAttendee() {
  const { id } = useParams(); // Get Event ID from URL
  const { token } = useAuth();
  const navigate = useNavigate();

  // State for form inputs
  const [attendee, setAttendee] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // State for error handling
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setAttendee({ ...attendee, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    // Create request payload
    const requestData = {
      ...attendee,
      eventId: parseInt(id), // Convert id to integer
    };

    try {
      await axios.post("http://localhost:5267/api/Attendees/register", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Registration successful!");
      navigate(`/event/${id}/Attendees`); // Redirect to Attendees page
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      setError(error.response?.data?.title || "Registration failed.");
    }
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(`/event/${id}`)}>
        <FaArrowLeft /> Back to Event
      </button>
      <h2 className="fw-bold">Register for Event {id}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={attendee.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={attendee.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            value={attendee.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterAttendee;
