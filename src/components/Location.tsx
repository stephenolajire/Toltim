import React, { useState, useEffect } from "react";

const Location: React.FC = () => {
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  // Load coordinates from localStorage on mount
  useEffect(() => {
    const savedLatitude = localStorage.getItem("latitude");
    const savedLongitude = localStorage.getItem("longitude");

    if (savedLatitude && savedLongitude) {
      setCoordinates({
        latitude: parseFloat(savedLatitude),
        longitude: parseFloat(savedLongitude),
      });
    }
  }, []);

  const getUserLocation = () => {
    setLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoordinates({
          latitude: lat,
          longitude: lng,
        });

        // Save to localStorage
        localStorage.setItem("latitude", lat.toString());
        localStorage.setItem("longitude", lng.toString());

        setLoadingLocation(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setLoadingLocation(false);
        console.error("Error getting location:", error);
      }
    );
  };

  return (
    <div>
      <button onClick={getUserLocation} disabled={loadingLocation}>
        {loadingLocation ? "Getting location..." : "Get My Location"}
      </button>

      {locationError && <p className="text-red-500">{locationError}</p>}

      {coordinates.latitude && coordinates.longitude && (
        <div>
          <p>Latitude: {coordinates.latitude}</p>
          <p>Longitude: {coordinates.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default Location;
