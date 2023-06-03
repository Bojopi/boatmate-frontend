import { axios } from "@/config/axios";


export const Portofolios = () => {

    const getPortofolioProvider = (idProvider: any) => axios.get(`/portofolios/${idProvider}`);

    const show = (idPortofolio: number) => axios.get(`/portofolio/${idPortofolio}`);

    const postImagesPortofolio = (idProvider: number, data: any, toast: any, setLoading: any, portofolio: any, setPortofolio: any) => {
        axios.post(`/portofolio/${idProvider}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
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

    const deleteImagePortofolio = (idPortofolio: number) => axios.delete(`/portofolio/${idPortofolio}`);

    const updatePortofolio = (idPortofolio: number, data: any, toast: any, setLoading: any, portofolio: any, setPortofolio: any) => {
        axios.post(`/update-portofolio/${idPortofolio}`, data)
        .then((res) => {
            const newData = res.data.portofolio[1][0];
            setPortofolio(portofolio.map((item: any) => {
                if (item.id_portofolio === idPortofolio) {
                    return {...portofolio, ...newData}
                }
                return item;
            }));
            setLoading(false);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };


    return {
        getPortofolioProvider,
        show,
        postImagesPortofolio,
        deleteImagePortofolio,
        updatePortofolio
    }
}

