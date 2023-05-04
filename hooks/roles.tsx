import { axios } from "@/config/axios";


export const Roles = () => {

    const getAllRoles = (setRoles: any, setLoading: any) => {
        axios.get('/roles')
        .then((res) => {
            setRoles(res.data.roles);
            setLoading(false);
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getAllRoles,
    }
}

