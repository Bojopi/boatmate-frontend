import axios from "axios";

export const Maps = () => {
    const getAddress = (lat: number, lng: number) => axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_APIKEY}`);

    return {
        getAddress
    }
}