export const calculateDistance = (userCoords, jobCoords) => {
  if (!userCoords || !jobCoords || jobCoords.length < 2) {
    return null;
  }

  const [jobLng, jobLat] = jobCoords;
  const { latitude: userLat, longitude: userLng } = userCoords;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(jobLat - userLat);
  const dLon = toRad(jobLng - userLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLat)) * Math.cos(toRad(jobLat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Add 10% buffer for upper bound approximation
  const upperBound = distance * 1.1;

  return upperBound;
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

export const formatDistance = (distanceInKm) => {
  if (distanceInKm === null || distanceInKm === undefined) {
    return 'Distance N/A';
  }

  if (distanceInKm < 1) {
    return `${Math.ceil(distanceInKm * 1000)} M`;
  } else {
    return `${Math.ceil(distanceInKm)} KM`;
  }
};
