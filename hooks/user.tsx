import { axios } from '@/config/axios';
import { useRouter } from 'next/router';

export const Users = () => {

    const router = useRouter();

    const getAllUsers = (setUsers: any, setLoading: any) => {
        axios.get('/profiles')
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

    const setUser = (id: number, data: any, setLoading: any, toast: any, setDataUser: any, setPersonalActive: any, setDetailActive: any) => {
        axios.post(`/profile/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            setLoading(false);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setDataUser();
            setPersonalActive(true);
            setDetailActive(true);
        }).catch(error => {
            console.log(error)
            setLoading(false)
            toast.current!.show({severity:'error', summary:'Error', detail: error.msg, life: 4000});
        })
    }


    return {
        getAllUsers,
        setRoleUser,
        setUser
    }
}

