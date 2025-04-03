import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { FaArrowLeft, FaSave } from "react-icons/fa";

function EditEvent() {
  const { id } = useParams(); // Get event ID from URL
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

  if (loading) return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <div className="container min-vh-100 d-flex flex-column align-items-center py-5">
      <Button variant="secondary" onClick={() => navigate("/dashboard")} className="mb-3">
        <FaArrowLeft /> Back to Dashboard
      </Button>

      <div className="card shadow-lg border-0 p-4" style={{ width: "30rem" }}>
        <h2 className="fw-bold text-center">Edit Event</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" value={eventData.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={eventData.description} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="location" value={eventData.location} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" name="startDate" value={eventData.startDate.split("T")[0]} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" name="endDate" value={eventData.endDate.split("T")[0]} onChange={handleChange} required />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            <FaSave className="me-2" /> Save Changes
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default EditEvent;
