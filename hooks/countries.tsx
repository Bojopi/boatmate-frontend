import Axios from 'axios'

const axios = Axios.create({
    baseURL: 'https://restcountries.com/v3.1',
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    // },
    // withCredentials: true,
});

export const Countries = () => {
    const getAllCountries = () => axios.get('/all');

    const indexEvents = () => axios.get('/api/appointments');

    const list = async (setAppointments: any, data: any) => {
        axios
            .post(`/api/appointments/list`, data)
            .then(res => {
                setAppointments(res.data);
            })
            .catch(error => {
                if (error.response.status !== 409) throw error;
            })
    };

    // const appointmentHistory = async (setAppointmentHistories: any, patientId: any, data: any) => {
    //     axios
    //         .post(`/api/reports/patients/${patientId}/appointment-history`, data)
    //         .then(res => {
    //             setAppointmentHistories(res.data);
    //         })
    //         .catch(error => {
    //             if (error.response.status !== 409) throw error;
    //         })
    // };

    // const create = async (data: any, setError: any) => {
    //     axios
    //         .post(`/api/appointments`, data)
    //         .then(res => {
    //             if(res.data.status){
    //                 toast.success(res.data.message, { theme: "colored"});
    //             }
    //             else {
    //                 toast.error(res.data.message, { theme: "colored"});
    //             }
    //         })
    //         .catch(error => {
    //             if (error.response.status !== 422) throw error;
    //             showErrors(error.response.data.errors, setError);
    //             toast.error("Existen errores en el formulario", { theme: "colored"});
    //         });
    // };

    // const edit = async (data: any, setError: any, appointmentId:number) => {
    //     axios
    //         .put(`/api/appointments/${appointmentId}`, data)
    //         .then(res => {
    //             if(res.data.status){
    //                 toast.success(res.data.message, { theme: "colored"});
    //             }
    //             else {
    //                 toast.error(res.data.message, { theme: "colored"});
    //             }
    //         })
    //         .catch(error => {
    //             if (error.response.status !== 422) throw error;
    //             showErrors(error.response.data.errors, setError);
    //             toast.error("Existen errores en el formulario", { theme: "colored"});
    //         });
    // };

    // const changeStatus = async (data: any, setError: any, appointment_id: number) => {
    //     axios
    //         .put(`/api/appointments/${appointment_id}/voided`, data)
    //         .then(res => {
    //             if(res.data.status){
    //                 toast.success(res.data.message, { theme: "colored"});
    //             }
    //             else {
    //                 toast.error(res.data.message, { theme: "colored"});
    //             }
    //         })
    //         .catch(error => {
    //             if (error.response.status !== 422) throw error;
    //             showErrors(error.response.data.errors, setError);
    //             toast.error("Existen errores en el formulario", { theme: "colored"});
    //         });
    // }

    return {
        getAllCountries
    }
}

