import { useState } from "react";

export function useWeatherData() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (latitude, longitude) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWeatherData(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching weather data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { weatherData, isLoading, error, fetchWeatherData };
}
