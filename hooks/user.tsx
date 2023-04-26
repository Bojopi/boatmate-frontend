import Axios from 'axios';
import { useRouter } from 'next/router';

const axios = Axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://boatmate-backend-production.up.railway.app',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export const Users = () => {

    const router = useRouter();

    const getAllUsers = (setUsers: any, setLoading: any) => {
        axios.post('/users')
        .then((res) => {
            console.log(res.data.users)
            setUsers(res.data.users);
            setLoading(false)
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }

    const setRoleUser = (idProfile: number, data: any, toast: any, setLoading: any) => {
        axios.post(`/user/${idProfile}`, data)
        .then((res) => {
            console.log(res)
            // if(res.data.role == 4) {
            // }
            toast.current.show({severity:'success', summary:'Successful', detail: 'Welcome!', life: 4000});
            setLoading(false);
            router.push('/admin');
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }


    return {
        getAllUsers,
        setRoleUser,
    }
}

