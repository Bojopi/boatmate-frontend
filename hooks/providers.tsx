import { axios } from "@/config/axios";
import { useRouter } from "next/router";


export const Providers = () => {

    const router = useRouter();

    const getAllProviders = (setProviders: any, setLoading: any) => {
        axios.get('/providers')
        .then((res) => {
            setProviders(res.data.providers);
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }

    const show = (idProvider: number) => axios.get(`/provider/${idProvider}`);

    const updateProvider = (idProvider: number, data: any, toast: any, setLoading: any) => {
        axios.post(`/provider-edit/${idProvider}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
            router.push('/welcome/providers');
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const getServicesProvider = (idProvider: number) => axios.get(`/service-provider/${idProvider}`);

    const deleteService = (idProvider: number, data: any) => axios.delete(`/service-provider/${idProvider}`, data);


    return {
        getAllProviders,
        show,
        updateProvider,
        getServicesProvider,
        deleteService
    }
}

