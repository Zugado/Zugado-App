// In-memory cache: "lat,lng" → { locality, city, state }
const _geocodeCache = {};

const _safeReverseGeocode = async (lat, lng) => {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;

  if (_geocodeCache[key]) return _geocodeCache[key];

  const fallback = {
    locality: 'Unknown',
    city: 'Unknown',
    state: 'Unknown',
    country: 'Unknown',
  };

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ZugadoApp/1.0',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) return fallback;

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) return fallback;

    const data = await response.json();

    const address = data.address || {};

    const result = {
      locality:
        address.suburb ||
        address.neighbourhood ||
        address.road ||
        'Unknown',

      city:
        address.city ||
        address.town ||
        address.village ||
        'Unknown',

      state: address.state || 'Unknown',

      country: address.country || 'Unknown',

      postcode:
        address.postcode ||
        address.pincode ||
        address.postal_code ||
        '',
    };

    _geocodeCache[key] = result;

    return result;
  } catch {
    return fallback;
  }
};

export const getLocationFromCoordinates = async coordinates => {
  if (!coordinates || coordinates.length < 2) {
    return {
      country: 'Unknown',
      city: 'Unknown',
      state: 'Unknown',
    };
  }

  const [lng, lat] = coordinates;

  return _safeReverseGeocode(lat, lng);
};
export const getCityFromCoordinates = async (lat, lng) => {
  const result = await _safeReverseGeocode(lat, lng);
  return { city: result.city, postcode: result.postcode };
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
