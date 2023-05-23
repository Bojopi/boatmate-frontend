import { axios } from "@/config/axios";
import { useRouter } from "next/router";


export const Roles = () => {

    const router = useRouter();

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
    };

    const createRole = (data: any, roleList: any, setRoleList: any, setLoading: any, toast: any) => {
        axios.post('/role', data)
        .then((res) => {
            const role = res.data.role
            setRoleList([...roleList, role]);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error.response.data.msg);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const show = (idRole: number) => axios.get(`/roles/${idRole}`);

    const updateRole = (idRole: number, data: any, roleList: any, setRoleList: any, setLoading: any, toast: any) => {
        axios.post(`/role/${idRole}`, data)
        .then((res) => {
            const role = res.data.role[1][0];
            setLoading(false);
            setRoleList(roleList.map((item: any) => {
                if (item.id_role === idRole) {
                    return {...roleList, ...role};
                }
                return item;
            }));
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            router.push('/welcome/roles');
        })
        .catch((error) => {
            console.log(error.response.data.msg);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const deleteRole = (idRole: number, roles: any, setRoles: any, toast: any, setLoading: any) => {
        axios.post(`delete-role/${idRole}`)
        .then((res) => {
            const state = res.data.role[1][0].role_state;
            const newList = roles.map((item: any) => {
                if (item.id_role === idRole) {
                    return {
                        ...item,
                        role_state: state
                    };
                }
                return item;
            });
            setRoles(newList);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    };

    const activateRole = (idRole: number, roles: any,  setRoles: any, toast: any, setLoading: any) => {
        axios.post(`/activate-role/${idRole}`)
        .then((res) => {
            const state = res.data.role[1][0].role_state
            const newList = roles.map((item: any) => {
                if(item.id_role === idRole) {
                    return {
                        ...item,
                        role_state: state
                    };
                }
                return item;
            });
            setRoles(newList);
            toast.current!.show({severity:'success', summary:'Successfull', detail: res.data.msg, life: 4000});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            toast.current!.show({severity:'error', summary:'Error', detail: error.response.data.msg, life: 4000});
            setLoading(false);
        })
    }


    return {
        getAllRoles,
        show,
        updateRole,
        deleteRole,
        createRole,
        activateRole
    }
}

