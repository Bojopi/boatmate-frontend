import Axios from 'axios'

export const axios = Axios.create({
    // baseURL: 'http://localhost:8080/api',
    baseURL: 'https://boatmate.com/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});