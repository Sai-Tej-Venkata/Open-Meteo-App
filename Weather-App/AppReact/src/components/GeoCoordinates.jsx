import { Component } from "react";

class GeoCoordinates extends Component {
  updateLatitude = (value) => {
    if (this.props.onLatitudeChange) {
      this.props.onLatitudeChange(value);
    }
  };

  updateLongitude = (value) => {
    if (this.props.onLongitudeChange) {
      this.props.onLongitudeChange(value);
    }
  };

  render() {
    // Convert numeric values to strings for input display
    const latitudeValue = this.props.latitude !== null && this.props.latitude !== undefined 
      ? String(this.props.latitude) 
      : "";
    
    const longitudeValue = this.props.longitude !== null && this.props.longitude !== undefined 
      ? String(this.props.longitude) 
      : "";

    return (
      <div>
        <div className="app-section">
          <h2>Geo Coordinates</h2>
        </div>

        <div className="geo-coords-section">
          <label>Latitude:</label>
          <div className="geo-coords">
            <input
              type="number"
              value={latitudeValue}
              step="0.01"
              onChange={(e) => this.updateLatitude(e.target.value)}
            />
          </div>
        </div>

        <div className="geo-coords-section">
          <label>Longitude:</label>
          <div className="geo-coords">
            <input
              type="number"
              value={longitudeValue}
              step="0.01"
              onChange={(e) => this.updateLongitude(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GeoCoordinates;
