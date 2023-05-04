import { axios } from "@/config/axios";


export const Boats = () => {

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
    }


    return {
        getAllBoats,
    }
}

