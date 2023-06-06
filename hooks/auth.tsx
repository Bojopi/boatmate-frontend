import { axios } from '@/config/axios';
import { useRouter } from 'next/router';



export const Auth = () => {

    const router = useRouter();

    const login = (data: any, toast: any, setLoading: any) => {
        axios
            .post('/auth', data)
            .then((res) => {
                setLoading(false);
                toast.current.show({severity:'success', summary:'Successful', detail: `${res.data.msg}`, life: 4000});
                if(res.data.role == 'CUSTOMER') {
                    router.push('/')
                } else {
                    router.push('/welcome')
                }
            })
            .catch(error => {
                console.log(error)
                toast.current.show({severity:'error', summary:'Error', detail: `${error.response.data.msg}`, life: 4000});
                setLoading(false);
            })
    };

    const getUserAuthenticated = () => axios.get('/profile')

    const logout = (setLoading: any) => {
        axios.post('/logout', {})
        .then((res) => {
            setLoading(false)
            router.push('/login')
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }

    const googleLogin = (data: any) => axios.post('/google', data);

    const createUSer = (data: any, toast: any, setLoading: any) => {
        axios.post('/create-profile', data)
        .then((res) => {
            toast.current.show({severity:'success', summary:'Successful', detail: `${res.data.msg}`, life: 4000});
            if(data.idRole == 4) {
                router.push('/');
            } else {
                router.push('/welcome');
            }
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            toast.current.show({severity:'error', summary:'Error', detail: `${err.response.data.msg}`, life: 4000});
            setLoading(false);
        })
    }

    return {
        login,
        getUserAuthenticated,
        logout,
        googleLogin,
        createUSer
    }
}

