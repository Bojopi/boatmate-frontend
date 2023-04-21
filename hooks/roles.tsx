import Axios from 'axios';
import { useRouter } from 'next/router';

const axios = Axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://boatmate-backend-production.up.railway.app',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export const Roles = () => {

    const router = useRouter();

    const getRoles = () => {
        axios.get('/roles', {withCredentials: true})
        .then((res) => {
            console.log(res)
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getRoles,
    }
}

