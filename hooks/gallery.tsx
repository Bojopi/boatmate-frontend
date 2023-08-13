import { axios } from "@/config/axios";


export const Galleries = () => {

    const getGalleryContract = (idContract: any) => axios.get(`/galleries/${idContract}`);

    const show = (idGallery: number) => axios.get(`/gallery/${idGallery}`);

    const postImagesGallery = (idContract: number, data: any, toast: any, setLoading: any, gallery: any, setGallery: any) => {
        axios.post(`/gallery/${idContract}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            const newData = res.data.gallery
            setGallery([...gallery, newData])
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };


    return {
        getGalleryContract,
        show,
        postImagesGallery
    }
}

