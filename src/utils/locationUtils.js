export const getLocationFromCoordinates = async (coordinates) => {
  if (!coordinates || coordinates.length < 2) {
    return { locality: 'Unknown', city: 'Unknown', state: 'Unknown' };
  }

  const [lng, lat] = coordinates;
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ZugadoApp/1.0'
        }
      }
    );
    
    const data = await response.json();
    const address = data.address || {};
    
    const locality = address.suburb || address.neighbourhood || address.road || 'Unknown';
    const city = address.city || address.town || address.village || 'Unknown';
    const state = address.state || 'Unknown';
    
    return { locality, city, state };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return { locality: 'Unknown', city: 'Unknown', state: 'Unknown' };
  }
};

export const parseAddress = (address) => {
  if (!address) return { locality: 'Unknown', city: 'Unknown', state: 'Unknown' };
  
  const parts = address.split(',').map(part => part.trim());
  console.log('Address parts:', parts);
  const state = parts[parts.length - 2] || 'Unknown';
  const city = parts[parts.length - 3] || 'Unknown';
  const locality = parts[0] || 'Unknown';
  
  return { locality, city, state };
};

export const getApproximateLocation = (coordinates, radiusInKm = 1) => {
  if (!coordinates || coordinates.length < 2) return coordinates;
  
  const [lng, lat] = coordinates;
  const earthRadius = 6371;
  
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomRadius = Math.random() * radiusInKm;
  
  const deltaLat = (randomRadius / earthRadius) * (180 / Math.PI);
  const deltaLng = (randomRadius / (earthRadius * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);
  
  const newLat = lat + deltaLat * Math.cos(randomAngle);
  const newLng = lng + deltaLng * Math.sin(randomAngle);
  
  return [newLng, newLat];
};
