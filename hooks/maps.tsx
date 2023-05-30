import axios from "axios";

export const Maps = () => {
    const getAddress = (lat: number, lng: number) => axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBfwNcp4UHQnucX_gq0_ThusY_ceSgAtyU`);

    return {
        getAddress
    }
}