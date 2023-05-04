import { axios } from "@/config/axios";


export const Rating = () => {

    const getRatingProvider = (id_provider: any) => axios.get(`/rating-provider/${id_provider}`)


    return {
        getRatingProvider,
    }
}

