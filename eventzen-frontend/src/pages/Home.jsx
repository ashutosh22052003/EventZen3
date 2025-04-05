import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Main Content */}
      <div
        className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-4"
        data-aos="fade-up"
      >
        <h1 className="fw-bold display-4 mb-3 text-primary">
          🎊 Welcome to EventZen
        </h1>
        <p className="lead text-muted mb-4" style={{ maxWidth: "600px" }}>
          Your one-stop platform to create, manage, and explore events with ease.
          Whether it's a workshop, seminar, or celebration—EventZen helps you stay organized.
        </p>
        <div className="d-flex gap-3">
          <Button variant="primary" size="lg" onClick={() => navigate("/login")}>
            🔐 Login
          </Button>
          <Button variant="outline-success" size="lg" onClick={() => navigate("/register")}>
            📝 Register
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-auto">
        <div className="container">
          <p className="mb-1">Ashutosh Kumar | Intern – T&T Engineering, Deloitte India</p>
          <small className="text-muted">
            Email: <a href="mailto:ashukuma.extr@deloitte.com" className="text-decoration-none text-light">ashukumar.ext@deloitte.com</a>
          </small>
        </div>
      </footer>
    </div>
  );
}

export default Home;
