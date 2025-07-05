import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import { calculateFootprint } from './api';
import './App.css';

const App = () => {
  const [theme, setTheme] = useState("light");
  const [result, setResult] = useState(() => {
    const saved = localStorage.getItem("carbon_result");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSubmit = async (formData) => {
    try {
      const data = await calculateFootprint(formData);
      setResult(data);
      localStorage.setItem("carbon_result", JSON.stringify(data));
    } catch (error) {
      console.error("API error:", error);
      alert("Failed to calculate. Make sure backend is running.");
    }
  };

  return (
    <div>
      {/* ✅ Hero Section (with toggle) */}
      <div className="hero">
        <h1>🌍 Carbon Footprint Tracker</h1>
        <p>
          <span style={{ fontWeight: '500' }}>Track</span> &nbsp; | &nbsp;
          <span style={{ fontWeight: '500' }}>Understand</span> &nbsp; | &nbsp;
          <span style={{ fontWeight: '500' }}>Reduce</span> <br />
          <span style={{ fontSize: '1.05rem', opacity: 0.85 }}>
            Your eco journey starts here.
          </span>
        </p>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
        </button>
      </div>

      {/* 🚀 Form Section */}
      <InputForm onSubmit={handleSubmit} />

      {/* 📊 Results Section */}
      {result && (
        <>
          <Results result={result} theme={theme} key={theme} />
          <button
            onClick={() => {
              const confirmDelete = window.confirm("Are you sure you want to clear your saved carbon footprint report?");
              if (confirmDelete) {
                setResult(null);
                localStorage.removeItem("carbon_result");
              }
            }}
            style={{
              margin: '24px auto 0',
              display: 'block',
              backgroundColor: '#ff4d4f',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#d9363e')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#ff4d4f')}
          >
            🗑 Clear Saved Report
          </button>
        </>
      )}

      <footer className="app-footer">
        ♻️ Built with purpose — 2025
      </footer>
    </div>
  );
};

export default App;
