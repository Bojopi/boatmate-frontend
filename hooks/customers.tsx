import axios from "axios";

export const Customers = () => {

    const getServiceHistory = (setServiceHistory: any, getServicesHistories: any, setLoading: any) => {
        axios.get('/service-history')
        .then((res) => {
            setServiceHistory(getServicesHistories(res.data.serviceHistory));
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getServiceHistory,
    }
}

