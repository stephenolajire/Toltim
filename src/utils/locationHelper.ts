export const getLocationAddress = async (
  postgisPoint: string
): Promise<string> => {
  try {
    // Extract coordinates from POINT (lng lat) format
    const match = postgisPoint.match(/POINT\s*\(([^)]+)\)/i);
    if (!match) return "Invalid location";

    const [lng, lat] = match[1].trim().split(/\s+/).map(Number);
    if (isNaN(lat) || isNaN(lng)) return "Invalid coordinates";

    // Reverse geocode using OpenStreetMap Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
      {
        headers: { "User-Agent": "BookingApp/1.0" },
      }
    );

    if (!response.ok) throw new Error("Geocoding failed");

    const data = await response.json();
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error("Error converting location:", error);
    return "Location unavailable";
  }
};
