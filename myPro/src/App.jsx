import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "fa77a885d09eae185b63de563c464ac0";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

export default function WeatherDashboard() {
  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("City not found. Try again.");
      }
      const data = await response.json();
      setWeather(data);
      updateHistory(city);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateHistory = (city) => {
    setHistory((prev) => {
      const newHistory = [city, ...prev.filter((c) => c !== city)].slice(0, 5);
      return newHistory;
    });
  };

  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <div className="search-bar">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={() => fetchWeather(city)} disabled={loading}>
          Search
        </button>
        <button onClick={() => setDarkMode(!darkMode)}>{darkMode?"☀️":"🌑"}</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>{weather.weather[0].description}</p>
          <p className="temperature">{weather.main.temp}°C</p>
          <button onClick={() => fetchWeather(city)}>Refresh</button>
        </div>
      )}

      <div className="history">
        <h3>Recent Searches</h3>
        <div className="history-list">
          {history.map((h, index) => (
            <button key={index} onClick={() => fetchWeather(h)} className="historyBtn">
              {h}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
