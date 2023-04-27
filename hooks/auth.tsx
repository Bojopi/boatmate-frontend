import Axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';


const axios = Axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://boatmate-backend-production.up.railway.app',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export const Auth = () => {

    const router = useRouter();

    const login = (data: any, toast: any, setLoading: any) => {
        axios
            .post('/auth', data)
            .then((res) => {
                // console.log('logueado')
                Cookies.set('token', res.data.token, {
                    expires: new Date(Date.now() + 3600000),
                    sameSite: 'none',
                    secure: true,
                    domain: 'boatmate-frontend.vercel.app',
                    path: '/'
                });
                setLoading(false);
                toast.current.show({severity:'success', summary:'Successful', detail: `${res.data.msg}`, life: 4000});
                router.push('/welcome')
                // localStorage.setItem('token', res.data.token);
            })
            .catch(error => {
                console.log(error.response)
                toast.current.show({severity:'error', summary:'Error', detail: `${error.response.data.msg}`, life: 4000});
                setLoading(false);
                // if (error.response.status !== 422) throw error
                // setErrorsBackend(Object.values(error.response.data.errors).flat());
            })
    };

    const getUserAuthenticated = (setUser: any) => {
        axios.get('/profile')
        .then((res) => {
            setUser(res.data);
            return
        })
        .catch(error => {
            console.log('Error:', error)
            return error.response.data.msg
        })
    }

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

    const googleLogin = (data: any, toast: any) => {
        axios.post('/google', data)
        .then((res) => {
            console.log(res)
            toast.current.show({severity:'success', summary:'Successful', detail: `${res.data.msg}`, life: 4000});
            if(!res.data.newUser) {
                router.push('/welcome')
            } else {
                router.push('/admin/preferences');
            }
        }).catch((err) => {
            console.log(err)
            toast.current.show({severity:'error', summary:'Error', detail: `${err.response.data.msg}`, life: 4000});
        });
    }

    return {
        login,
        getUserAuthenticated,
        logout,
        googleLogin
    }
}

