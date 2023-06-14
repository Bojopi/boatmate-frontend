import { axios } from "@/config/axios";


export const Services = () => {

    const getAllServices = () => axios.get('/services');

    const show = (idService: number) => axios.get(`/service/${idService}`);

    const createService = (data: any, serviceList: any, setServiceList: any, setLoading: any, toast: any, setVisible: any) => {
        axios.post('/service', data)
        .then((res) => {
            const service = res.data.service
            setServiceList([...serviceList, service]);
            setVisible(false);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error.response.data.msg);
            setVisible(false);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const updateService = (idService: number, data: any, serviceList: any, setServiceList: any, setLoading: any, toast: any, setVisible: any) => {
        axios.post(`/service/${idService}`, data)
        .then((res) => {
            const service = res.data.service;
            setVisible(false);
            setServiceList(serviceList.map((item: any) => {
                if (item.id_service === idService) {
                    return {...serviceList, ...service};
                }
                return item;
            }));
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error.response.data.msg);
            setVisible(false);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const activateService = (idService: number, services: any,  setServices: any, toast: any, setLoading: any) => {
        axios.post(`/activate-service/${idService}`)
        .then((res) => {
            const state = res.data.service[1][0].service_state
            const newList = services.map((item: any) => {
                if(item.id_service === idService) {
                    return {
                        ...item,
                        service_state: state
                    };
                }
                return item;
            });
            setServices(newList);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const deleteService = (idService: number, services: any, setServices: any, toast: any, setLoading: any) => {
        axios.post(`delete-service/${idService}`)
        .then((res) => {
            const state = res.data.service[1][0].service_state;
            const newList = services.map((item: any) => {
                if (item.id_service === idService) {
                    return {
                        ...item,
                        service_state: state
                    };
                }
                return item;
            });
            setServices(newList);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const getProvidersService = (idService: number) => axios.get(`/provider-service/${idService}`);

    const findByNameProvidersService = (data: any) => axios.post('/provider-service', data);

    const getPopularServices = (zip: string) => axios.get(`/popular-services/${zip}`);

    return {
        getAllServices,
        activateService,
        deleteService,
        show,
        createService,
        updateService,
        getProvidersService,
        findByNameProvidersService,
        getPopularServices
    }
}

