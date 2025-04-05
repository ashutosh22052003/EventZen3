import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { FaArrowLeft, FaSave } from "react-icons/fa";

function EditEvent() {
  const { id } = useParams();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await axios.get(`http://localhost:5267/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEventData(response.data);
      } catch (error) {
        setError(error.response?.data || "Failed to fetch event.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id, token]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5267/api/events/${id}`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data || "Failed to update event.");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-5 bg-light">
      <Button variant="outline-secondary" onClick={() => navigate("/dashboard")} className="mb-4 align-self-start">
        <FaArrowLeft className="me-2" /> Back to Dashboard
      </Button>

      <div className="card shadow-lg p-4 border-0" style={{ width: "100%", maxWidth: "600px" }}>
        <h2 className="text-center text-primary fw-bold mb-4">📝 Edit Event</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={eventData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={eventData.startDate?.split("T")[0]}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={eventData.endDate?.split("T")[0]}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100 fw-bold">
            <FaSave className="me-2" />
            Save Changes
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default EditEvent;
