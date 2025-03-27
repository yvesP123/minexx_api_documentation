// components/Header.js
import React from 'react';
import '../styles/Header.css';

const Header = ({ darkMode, setDarkMode }) => {
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header>
      <div className="header-content">
        <h1>Minexx API Documentation</h1>
        <div className="theme-toggle">
          <label htmlFor="dark-mode-toggle">Dark Mode</label>
          <label className="switch">
            <input 
              type="checkbox" 
              id="dark-mode-toggle" 
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;