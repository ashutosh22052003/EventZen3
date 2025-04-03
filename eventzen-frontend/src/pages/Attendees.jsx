import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";

function Attendees() {
  const { id } = useParams(); // Event ID
  const { token } = useAuth();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchAttendees() {
      try {
        const response = await axios.get(`http://localhost:5267/api/Attendees/event/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendees(response.data);
      } catch (error) {
        console.error("Error fetching attendees:", error.response?.data || error.message);
      }
    }

    fetchAttendees();
  }, [id, token, navigate]);

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(`/event/${id}`)}>
        <FaArrowLeft /> Back to Event
      </button>
      <h2 className="fw-bold">Attendees for Event {id}</h2>
      {attendees.length > 0 ? (
        <ul className="list-group">
          {attendees.map((attendee) => (
            <li key={attendee.id} className="list-group-item">
              {attendee.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No attendees registered yet.</p>
      )}
    </div>
  );
}

export default Attendees;
