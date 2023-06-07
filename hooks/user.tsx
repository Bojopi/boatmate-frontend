import { axios } from '@/config/axios';
import { useRouter } from 'next/router';

export const Users = () => {

    const router = useRouter();

    const getAllUsers = (setUsers: any, setLoading: any) => {
        axios.get('/profiles')
        .then((res) => {
            setUsers(res.data.users);
            setLoading(false)
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }

    const setRoleUser = (idProfile: number, data: any, toast: any, setLoading: any) => {
        axios.post(`/profile-role/${idProfile}`, data)
        .then((res) => {
            toast.current.show({severity:'success', summary:'Successful', detail: 'Welcome!', life: 4000});
            setLoading(false);
            router.push('/welcome');
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }

    const updateProfile = (id: number, data: any, setLoading: any, toast: any, setDataUser: any, setPersonalActive: any, setDetailActive?: any) => {
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
    };

    const createNewUser = (data: any, users: any, setUsers: any, setLoading: any, toast: any) => {
        axios.post('/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            const user = res.data.user;
            setUsers({...users, user});
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            router.push('/welcome/users')
            setLoading(false);
        })
        .catch((error) => {
            console.log(error.response.data.msg);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false)
        })
    }

    const show = (idProfile: number) => axios.get(`/profile/${idProfile}`);

    const updateUser = (idProfile: number, data: any, setLoading: any, toast: any) => {
        axios.post(`/profile-edit/${idProfile}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            setLoading(false);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            router.push('/welcome/users');
        })
        .catch((error) => {
            console.log(error.response.data.msg);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    }

    const deleteUser = (idProfile: number) => axios.post(`delete-profile/${idProfile}`);

    const activateUser = (idProfile: number, profiles: any,  setProfiles: any, toast: any, setLoading: any) => {
        axios.post(`/activate-profile/${idProfile}`)
        .then((res) => {
            const state = res.data.profile[1][0].profile_state
            const updateProfile = profiles.map((item: any) => {
                if(item.id_profile === idProfile) {
                    return {
                        ...item,
                        profile_state: state
                    };
                }
                return item;
            });
            setProfiles(updateProfile);
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
        getAllUsers,
        setRoleUser,
        updateProfile,
        createNewUser,
        show,
        updateUser,
        deleteUser,
        activateUser
    }
}

