import { axios } from "@/config/axios";


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

