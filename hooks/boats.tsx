import Axios from 'axios';

const axios = Axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://boatmate-backend-production.up.railway.app',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export const Boats = () => {

    const getAllBoats = (setBoats: any, getBoats: any, setLoading: any) => {
        axios.get('/boats')
        .then((res) => {
            setBoats(getBoats(res.data.boats));
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getAllBoats,
    }
}

