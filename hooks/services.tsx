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

export const Services = () => {

    const getAllServices = (setServices: any, setLoading: any) => {
        axios.get('/services')
        .then((res) => {
            setServices(res.data.services);
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getAllServices,
    }
}

