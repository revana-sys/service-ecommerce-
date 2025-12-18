import React from 'react';
import './About.css'; 

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About RS Style</h1>
        <p>Empowering your style journey with comfort and elegance.</p>
      </div>

      <div className="about-content">
        <div className="about-text">
          <p>
            RS Style is dedicated to bringing you high-quality, affordable fashion that fits every lifestyle.
            With a passion for detail and a love for community, we’re here to make style simple, accessible, and enjoyable.
          </p>
          <p>
            Founded in 2015, our mission has always been to offer curated collections that combine timeless trends with everyday comfort.
            Whether you're shopping for a special occasion or everyday essentials, RS Style has something for you.
          </p>
        </div>
        <div className="about-image">
          <img src="/images/about-us.jpg" alt="About RS Style" />
        </div>
      </div>

      <div className="about-footer">
        &copy; 2025 RS Style. All rights reserved.
      </div>
    </div>
  );
};

export default About;
