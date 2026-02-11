export class WeatherService {
  async fetchWeatherData(latitude, longitude) {
    try {
      const url = `https://localhost:7174/api/v1/weather?latitude=${latitude}&longitude=${longitude}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }
}
