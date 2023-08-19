import axios from "axios";

export const Maps = () => {
    const getAddress = (lat: number, lng: number) => axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC-K6LZapV6N0hI0kjJIVcZuU927qEVeiM`);

    return {
        getAddress
    }
}