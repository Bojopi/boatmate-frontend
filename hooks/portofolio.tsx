import { axios } from "@/config/axios";
import { useRouter } from "next/router";


export const Portofolios = () => {

    const router = useRouter();

    const getPortofolioProvider = (idProvider: any, setPortofolio: any) => {
        axios.get(`/portofolio/${idProvider}`)
        .then((res) => {
            console.log(res)
            setPortofolio(res.data.portofolio);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    };

    const show = (idProvider: number) => axios.get(`/provider/${idProvider}`);

    const postImagesPortofolio = (idProvider: number, data: any, toast: any, setLoading: any, portofolio: any, setPortofolio: any) => {
        axios.post(`/portofolio/${idProvider}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            console.log(res.data)
            const newData = res.data.portofolio
            setPortofolio([...portofolio, newData])
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const deleteImagePortofolio = (idPortofolio: number) => axios.delete(`/portofolio/${idPortofolio}`)


    return {
        getPortofolioProvider,
        show,
        postImagesPortofolio,
        deleteImagePortofolio
    }
}

