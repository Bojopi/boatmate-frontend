import { axios } from "@/config/axios";

export const Customers = () => {

    const getAllCustomers = () => axios.get('/customers');

    const show = (idCustomer: number) => axios.get(`/customer/${idCustomer}`);


    return {
        getAllCustomers,
        show
    }
}

