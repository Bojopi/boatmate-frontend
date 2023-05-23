import { axios } from "@/config/axios";
import { useRouter } from "next/router";


export const Boats = () => {
    const router = useRouter();

    const getAllBoats = (setBoats: any, getBoats: any, setLoading: any) => {
        axios.get('/boats')
        .then((res) => {
            setBoats(getBoats(res.data.boats));
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    };

    const show = (idBoat: number) => axios.get(`/boat/${idBoat}`);

    const createBoat = (idCustomer:number, data: any, toast: any, setLoading: any) => {
        axios.post(`/boat/${idCustomer}`, data)
        .then((res) => {
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
            router.push('/welcome/boats')
        })
        .catch((error) => {
            console.log('Error:', error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const updateBoat = (idBoat: number, data: any, toast: any, setLoading: any) => {
        axios.post(`/update-boat/${idBoat}`, data)
        .then((res) => {
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
            router.push('/welcome/boats')
        })
        .catch((error) => {
            console.log('Error:', error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const deleteBoat = (idBoat: number) => axios.delete(`/delete-boat/${idBoat}`);


    return {
        getAllBoats,
        show,
        createBoat,
        updateBoat,
        deleteBoat
    }
}

