import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Home as HomeIcon,
  LocationOn,
  CalendarToday,
} from "@mui/icons-material";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
      setSnackbar({ open: true, message: "Event deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete event.", severity: "error" });
    }
  };

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const start = new Date(event.startDate);
    if (filter === "upcoming") return start >= now;
    if (filter === "past") return start < now;
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          🎉 Event Dashboard
        </Typography>
        <div>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/Home")}
            sx={{ mr: 2 }}
          >
            Home
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/create-event")}
            sx={{ mr: 2 }}
          >
            Create Event
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </Grid>

      {/* Filter Buttons */}
      <Grid container justifyContent="center" mb={3}>
        <ToggleButtonGroup
          color="primary"
          value={filter}
          exclusive
          onChange={(e, val) => val && setFilter(val)}
        >
          <ToggleButton value="all">All Events</ToggleButton>
          <ToggleButton value="upcoming">Upcoming</ToggleButton>
          <ToggleButton value="past">Past</ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <Grid container justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Grid>
      ) : filteredEvents.length > 0 ? (
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card elevation={4}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {event.description}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn fontSize="small" sx={{ mr: 1 }} />
                    {event.location}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                    {new Date(event.startDate).toDateString()} -{" "}
                    {new Date(event.endDate).toDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    color="warning"
                    onClick={() => navigate(`/event/edit/${event.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" color="text.secondary" align="center">
          No events available.
        </Typography>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default Dashboard;
