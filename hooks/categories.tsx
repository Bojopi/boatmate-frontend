import { axios } from "@/config/axios";


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

