const EARTH_RADIUS_MILES = 3958.8;

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distance = EARTH_RADIUS_MILES * c;
    return distance.toFixed(2);
}

function toRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
}