import React from "react";
import { MapPin } from "lucide-react";
import { getLocationAddress } from "../utils/locationHelper";

interface LocationDisplayProps {
  location: string;
  showIcon?: boolean;
  className?: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  location,
  showIcon = true,
  className = "flex items-center gap-2 text-xs text-gray-600",
}) => {
  const [address, setAddress] = React.useState<string>("Loading address...");

  React.useEffect(() => {
    if (location) {
      getLocationAddress(location)
        .then(setAddress)
        .catch(() => setAddress("Location unavailable"));
    } else {
      setAddress("No location provided");
    }
  }, [location]);

  return (
    <div className={className}>
      {showIcon && <MapPin className="h-3 w-3 flex-shrink-0" />}
      <span className="truncate">{address}</span>
    </div>
  );
};

export default LocationDisplay;
