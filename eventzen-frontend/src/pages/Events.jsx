import { useState, useEffect } from "react";
import axios from "axios";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Get token from localStorage (assuming login stores JWT)
        const token = localStorage.getItem("authtoken");

        if (!token) {
          setError("Unauthorized! Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5267/api/events", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setEvents(response.data);
      } catch (err) {
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <h2>Loading events...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div>
      <h2>List of Events (Protected Page)</h2>
      {events.length > 0 ? (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <strong>{event.name}</strong> - {event.date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
}

export default Events;
