import Axios from 'axios';

const axios = Axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://boatmate-backend-production.up.railway.app',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export const Providers = () => {

    const getAllProviders = (setProviders: any, setLoading: any) => {
        axios.get('/providers')
        .then((res) => {
            console.log(res.data.providers)
            setProviders(res.data.providers);
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getAllProviders,
    }
}

