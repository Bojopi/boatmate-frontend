import { axios } from "@/config/axios";

export const Contracts = () => {

    const getContracts = (setServiceHistory: any, getServicesHistories: any, setLoading: any) => {
        axios.get('/contracts')
        .then((res) => {
            setServiceHistory(getServicesHistories(res.data.contracts));
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    };

    const updateContract = (idContract: number, data: any, contracts: any, setContracts: any, toast: any, setLoading: any) => {
        axios.post(`/update-contract/${idContract}`, data)
        .then((res) => {
            const newData = res.data.contract[1][0];
            const newList = contracts.map((item: any) => {
                if (item.id_contract === idContract) {
                    return {
                        ...item,
                        price: newData.price,
                        contract_state: newData.contract_state,
                        contract_description: newData.contract_description
                    }
                }
                return item;
            })
            setContracts(newList);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log('Error:', error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const hiredServices = () => axios.get('/hired-services');

    const getContractsProvider = (idProvider: number) => axios.get(`/contract-provider/${idProvider}`);
    
    const getContractsCustomer = (idCustomer: number) => axios.get(`/contract-customer/${idCustomer}`);

    const updateState = (idContract: number, data: any) => axios.post(`/state-contract/${idContract}`, data);
   
    const createContract = (idCustomer: number, data: any, setLoading: any, toast: any, setVisible: any) => {
        axios.post(`/contract/${idCustomer}`, data)
        .then((res) => {
            console.log(res)
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setVisible(false);
            setLoading(false);
        })
        .catch((error) => {
            console.log('Error:', error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    }


    return {
        getContracts,
        updateContract,
        getContractsProvider,
        getContractsCustomer,
        updateState,
        createContract,
        hiredServices
    }
}

