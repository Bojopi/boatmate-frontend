import Axios from 'axios';

const axios = Axios.create({
    // baseURL: 'http://localhost:8080/api',
    baseURL: 'https://boatmate-backend-production.up.railway.app/api',
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    // },
    withCredentials: true,
});

export const Customers = () => {

    const getServiceHistory = (setServiceHistory: any, getServicesHistories: any, setLoading: any) => {
        axios.get('/service-history')
        .then((res) => {
            setServiceHistory(getServicesHistories(res.data.serviceHistory));
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getServiceHistory,
    }
}

