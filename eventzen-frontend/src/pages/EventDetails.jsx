import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";

function EventDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchEvent() {
      try {
        const response = await axios.get(`http://localhost:5267/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error.response?.data || error.message);
        navigate("/dashboard");
      }
    }

    fetchEvent();
  }, [id, token, navigate]);

  if (!event) {
    return <p className="text-center mt-5">Loading event details...</p>;
  }

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/dashboard")}>
        <FaArrowLeft /> Back to Dashboard
      </button>
      <h2 className="fw-bold">{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Start Date:</strong> {new Date(event.startDate).toDateString()}</p>
      <p><strong>End Date:</strong> {new Date(event.endDate).toDateString()}</p>
      <button className="btn btn-success me-2" onClick={() => navigate(`/event/${id}/register`)}>
    Register as Attendee
  </button>
  <button className="btn btn-info" onClick={() => navigate(`/event/${id}/attendees`)}>
    View Attendees
  </button>
    </div>
    
  );
}

export default EventDetails;
