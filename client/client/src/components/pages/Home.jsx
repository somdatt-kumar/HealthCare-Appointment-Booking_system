import React from 'react';
import { Link } from 'react-router-dom';
import './pages.css';  // Correct path since both files are in the same directory

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Health, Our Priority</h1>
          <p>Book appointments with top specialists in just a few clicks</p>
          <div className="hero-buttons">
            <Link to="/doctors" className="btn btn-primary">
              Find a Doctor
            </Link>
            <Link to="/register" className="btn btn-outline">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <h3>Expert Doctors</h3>
            <p>Board-certified specialists with years of experience</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>Easy Booking</h3>
            <p>24/7 online scheduling at your convenience</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>Minimal Wait Times</h3>
            <p>See your doctor when you need to</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to take control of your health?</h2>
        <Link to="/register" className="btn btn-primary">
          Get Started Today
        </Link>
      </section>
    </div>
  );
};

export default Home;