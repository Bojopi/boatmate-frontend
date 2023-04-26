import Axios from 'axios';

const axios = Axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://boatmate-backend-production.up.railway.app',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export const Roles = () => {

    const getAllRoles = (setRoles: any, setLoading: any) => {
        axios.get('/roles')
        .then((res) => {
            setRoles(res.data.roles);
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getAllRoles,
    }
}
