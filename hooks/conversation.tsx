import { axios } from "@/config/axios";


export const Conversations = () => {

    // const getAllRatigns = (setRatings: any, setFilterRating: any, setLoading: any, filter?: boolean) => {
    //     axios.get('/ratings')
    //     .then((res) => {
    //         setRatings(res.data.ratings);
    //         setFilterRating(res.data.ratings);
    //         if(filter) {
    //             const filterList = res.data.ratings.slice(0, 10).filter((item: any) => item.rating > 3);
    //             setRatings(filterList);
    //             setFilterRating(filterList);
    //         }
    //         setLoading(false);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         setLoading(false);
    //     })
    // };

    // const getRatingProvider = (id_provider: number) => axios.get(`/provider-rating/${id_provider}`);

    const getConversation = (idContract: number) => axios.get(`/conversation/${idContract}`);

    const sendMessage = (idContract: number, data: any, chat: any, setChat: any, toast: any, setLoading: any) => {
        axios.post(`/new- message/${idContract}`, data)
        .then((res) => {
            console.log(res)
            // toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            // setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    }

    // const updateRating = (idRating: number, data: any, ratings: any, setRatings: any, toast: any, setLoading: any, setVisible: any) => {
    //     axios.post(`/update-rating/${idRating}`, data)
    //     .then((res) => {
    //         const newRating = res.data.rating[1][0];
    //         setVisible(false);
    //         const newRatings = ratings.map((item: any) => {
    //             if (item.id_rating === idRating) {
    //                 return {
    //                     ...item,
    //                     review: newRating.review,
    //                     rating: newRating.rating
    //                 };
    //             }
    //             return item;
    //         });
    //         setRatings(newRatings);
    //         toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
    //         setLoading(false);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         setVisible(false);
    //         toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
    //         setLoading(false);
    //     })
    // }

    // const changeVisible = (idRating: number, data: any, ratings: any, setRatings: any, toast: any, setLoading: any) => {
    //     axios.post(`/visible-rating/${idRating}`, data)
    //     .then((res) => {
    //         const newStatus = res.data.rating[1][0];
    //         const newRatings = ratings.map((item: any) => {
    //             if (item.id_rating === idRating) {
    //                 return {
    //                     ...item,
    //                     provider_visible: newStatus.provider_visible
    //                 };
    //             }
    //             return item;
    //         });
    //         setRatings(newRatings);
    //         toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
    //         setLoading(false);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
    //         setLoading(false);
    //     })
    // }


    return {
        // getAllRatigns,
        // getRatingProvider,
        getConversation,
        sendMessage,
        // updateRating,
        // changeVisible
    }
}

