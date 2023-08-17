import { axios } from "@/config/axios";
import { useRouter } from "next/router";


export const Providers = () => {

    const router = useRouter();

    const getAllProviders = () => axios.get('/providers')
    // const getAllProviders = (setProviders: any, setLoading: any) => {
    //     axios.get('/providers')
    //     .then((res) => {
    //         setProviders(res.data.providers);
    //         setLoading(false);
    //     })
    //     .catch(error => {
    //         console.log('Error:', error)
    //         return error.response.data.msg
    //     })
    // }

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

    //Services

    const getServicesProvider = (idProvider: number) => axios.get(`/service-provider/${idProvider}`);
    
    const getOneServiceProvider = (idServiceProvider: number) => axios.get(`/one-service-provider/${idServiceProvider}`);

    const showServiceProvider = (idProvider: number, idService: number) => axios.get(`service-provider/${idProvider}/${idService}`);

    const addService = (idProvider: number, data: any, toast: any, setLoading: any, closeModal: any, serviceList: any, setServiceList: any) => {
        axios.post(`/service-provider/${idProvider}`, data)
        .then((res) => {
            const newService = res.data.service;
            setServiceList([...serviceList, newService]);
            closeModal();
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            closeModal();
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const updateServiceProvider = (
        idProvider: number, 
        idService: number, 
        data: any,
        toast: any,
        setLoading: any,
        setVisible: any,
        serviceList: any, 
        setServiceList: any) => {
        axios.post(`/service-provider-edit/${idProvider}/${idService}`, data)
        .then((res) => {
            const newDescription = res.data.service_description[1][0].service_provider_description
            const newService = serviceList.map((item: any) => {
                if(item.id_service === idService) {
                    return {
                        ...item,
                        service_provider_description: newDescription
                    };
                }
                return item;
            })
            setServiceList(newService);
            setVisible(false);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setVisible(false);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const deleteService = (idProvider: number, idService: number) => axios.delete(`/service-provider/${idProvider}/${idService}`);

    //licenses
    const uploadLicense = (idProvider: number, data: any, toast: any, setLoading: any, setLicenseList: any) => {
        axios.post(`/provider-license/${idProvider}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            if(res.data.license.length > 0) {
                setLicenseList(res.data.license)
            } else {
                setLicenseList([res.data.license])
            }
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const getLicenses = (idProvider: number) => axios.get(`/provider-license/${idProvider}`);


    return {
        getAllProviders,
        show,
        updateProvider,
        getServicesProvider,
        deleteService,
        updateServiceProvider,
        showServiceProvider,
        addService,
        uploadLicense,
        getLicenses,
        getOneServiceProvider
    }
}

