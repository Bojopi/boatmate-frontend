import { axios } from "@/config/axios";
import { useRouter } from "next/router";


export const Stripes = () => {

    const router = useRouter();

    const createAccount = (idProvider: number, data: any, toast: any, setLoading: any) => {
        axios.post(`/stripe-create/${idProvider}`, data)
        .then((res) => {
            router.push(res.data.accountLink.url);
            setLoading(false);
        })
        .catch((error) => {
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const createPaymentMethod = (data: any) => {
        axios.post('/payment-method-create', data)
        .then((res) => {
            console.log(res)
        })
        .catch((error) => {
            console.log(error)
        })
    }


    return {
        createAccount,
        createPaymentMethod
    }
}

