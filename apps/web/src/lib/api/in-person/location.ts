export const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

export const calculateDistance = ({
  location1,
  location2,
}: {
  location1: { lat: number; lng: number };
  location2: { lat: number; lng: number };
}) => {
  const { lat: lat1, lng: lng1 } = location1;
  const { lat: lat2, lng: lng2 } = location2;

  const R = 6371000; // Radius of the Earth in meters
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters
  return distance;
};

export const checkIfWithinRange = ({
  eventLocation,
  userLocation,
  rangeInMeters,
}: {
  userLocation: { lat: number; lng: number };
  eventLocation: { lat: number; lng: number };
  rangeInMeters: number;
}) => {
  const distance = calculateDistance({
    location1: userLocation,
    location2: eventLocation,
  });
  return distance <= rangeInMeters;
};
