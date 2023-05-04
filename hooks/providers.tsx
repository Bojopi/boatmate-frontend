import { axios } from "@/config/axios";


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

