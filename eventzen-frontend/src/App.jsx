import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import CreateEvent from "./pages/CreateEvent";
import Attendees from "./pages/Attendees";
import RegisterAttendee from "./pages/RegisterAttendee";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function AuthRedirect() {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : <Login />;
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/event/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
        <Route path="/event/edit/:id" element={<PrivateRoute><EditEvent /></PrivateRoute>} />
        <Route path="/create-event" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
        <Route path="/event/:id/register" element={<RegisterAttendee />} />
        <Route path="/home" element={<Home />} />
        {/* New Attendee Management Routes */}
        <Route path="/event/:id/attendees" element={<PrivateRoute><Attendees /></PrivateRoute>} />
        <Route path="/event/:id/register" element={<PrivateRoute><RegisterAttendee /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
