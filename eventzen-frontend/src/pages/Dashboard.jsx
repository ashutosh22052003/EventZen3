import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaMapMarkerAlt, FaCalendarAlt, FaSignOutAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Toast, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await axios.get("http://localhost:5267/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        setError(error.response?.data || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [navigate]);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5267/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete event.");
    }
  };

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    if (filter === "upcoming") return startDate >= now;
    if (filter === "past") return startDate < now;
    return true;
  });

  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center py-5 bg-light">
      {/* Header Section */}
      <div className="w-100 d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">🎉 Event Dashboard</h2>
        <div>
          <Button onClick={() => navigate("/create-event")} variant="success" className="me-2">
            ➕ Create Event
          </Button>
          <Button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            variant="danger"
          >
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-3">
        <Button
          variant={filter === "all" ? "primary" : "secondary"}
          className="me-2"
          onClick={() => setFilter("all")}
        >
          All Events
        </Button>
        <Button
          variant={filter === "upcoming" ? "primary" : "secondary"}
          className="me-2"
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === "past" ? "primary" : "secondary"}
          onClick={() => setFilter("past")}
        >
          Past
        </Button>
      </div>

      {/* Error Notification */}
      {error && (
        <Toast className="mb-3 bg-danger text-white p-3">
          <strong>Error:</strong> {error}
        </Toast>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="row w-100 justify-content-center">
          {filteredEvents.map((event) => (
            <div key={event.id} className="col-md-4 col-sm-6 d-flex justify-content-center">
              <div className="card shadow-lg border-0 p-3 m-3 text-center" style={{ width: "28rem" }}>
                <h5 className="card-title fw-bold">{event.title}</h5>
                <p className="card-text text-muted">{event.description}</p>
                <div className="d-flex align-items-center justify-content-center text-secondary">
                  <FaMapMarkerAlt className="me-2 text-primary" /> {event.location}
                </div>
                <div className="d-flex align-items-center justify-content-center text-secondary my-2">
                  <FaCalendarAlt className="me-2 text-success" />
                  {new Date(event.startDate).toDateString()} - {new Date(event.endDate).toDateString()}
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <button className="btn btn-primary d-flex align-items-center" onClick={() => navigate(`/event/${event.id}`)}>
                    <FaEye className="me-2" /> View
                  </button>
                  <button className="btn btn-warning d-flex align-items-center" onClick={() => navigate(`/event/edit/${event.id}`)}>
                    <FaEdit className="me-2" /> Edit
                  </button>
                  <button className="btn btn-danger d-flex align-items-center" onClick={() => handleDelete(event.id)}>
                    <FaTrash className="me-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted fs-5">No events available.</p>
      )}
    </div>
  );
}

export default Dashboard;
