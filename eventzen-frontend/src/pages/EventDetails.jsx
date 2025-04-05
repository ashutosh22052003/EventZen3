import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

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
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading event details...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Back Button */}
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate("/dashboard")}>
        <FaArrowLeft className="me-2" /> Back to Dashboard
      </button>

      {/* Event Card */}
      <div className="card shadow-lg border-0">
        <div className="card-body">
          <h2 className="card-title text-primary fw-bold mb-3">
            <FaClipboardList className="me-2" />
            {event.title}
          </h2>
          <p className="card-text fs-5 text-muted">{event.description}</p>

          <hr />

          <p className="mb-2">
            <FaMapMarkerAlt className="me-2 text-danger" />
            <strong>Location:</strong> {event.location}
          </p>
          <p className="mb-2">
            <FaCalendarAlt className="me-2 text-success" />
            <strong>Start:</strong> {new Date(event.startDate).toLocaleString()}
          </p>
          <p className="mb-4">
            <FaCalendarAlt className="me-2 text-warning" />
            <strong>End:</strong> {new Date(event.endDate).toLocaleString()}
          </p>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-4">
            <button
              className="btn btn-success px-4"
              onClick={() => navigate(`/event/${id}/register`)}
            >
              ✅ Register as Attendee
            </button>
            <button
              className="btn btn-info text-white px-4"
              onClick={() => navigate(`/event/${id}/attendees`)}
            >
              👥 View Attendees
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
