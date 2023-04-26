import Axios from 'axios';

const axios = Axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://boatmate-backend-production.up.railway.app',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export const Categories = () => {

    const getAllCategories = (setCategories: any, setLoading: any) => {
        axios.get('/categories')
        .then((res) => {
            setCategories(res.data.categories);
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getAllCategories,
    }
}

