import Axios from 'axios';

const axios = Axios.create({
    // baseURL: 'http://localhost:8080/api',
    // baseURL: 'https://boatmate-backend-production.up.railway.app/api',
    baseURL: 'http://ec2-3-131-141-161.us-east-2.compute.amazonaws.com:8080/api',
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    // },
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

