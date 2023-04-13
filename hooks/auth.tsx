import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'https://boatmate-backend-production.up.railway.app',
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    // },
    // withCredentials: true,
});

export const Auth = () => {
    const login = async (data: any, toast: any, setLoading: any) => {
        axios
            .post('/auth', data)
            .then((res) => {
                console.log('logueado')
                console.log(res)
            })
            .catch(error => {
                console.log(error.response)
                toast.current.show({severity:'error', summary:'Error', detail: `${error.response.data.msg}`, life: 4000});
                setLoading(false);
                // if (error.response.status !== 422) throw error
                // setErrorsBackend(Object.values(error.response.data.errors).flat());
            })
    };

    return {
        login
    }
}

