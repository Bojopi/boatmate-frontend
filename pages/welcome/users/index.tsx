import LayoutAdmin from '@/components/layoutAdmin';
import { Auth } from '@/hooks/auth';
import { Profile, User } from '@/interfaces/interfaces';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState, useRef } from 'react';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Users } from '@/hooks/user';
import Link from 'next/link';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from 'primereact/tooltip';
// import View from './view'

const Index = () => {
    const {getAllUsers, deleteUser, activateUser} = Users();
    const { getUserAuthenticated } = Auth();

    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<Profile>(
        {
            uid:                 0,
            email:               '',
            state:               false,
            google:               false,
            idPerson:            0,
            name:                '',
            lastname:            '',
            phone:               '',
            image:               '',
            idRole:              0,
            role:                '',
            idProvider:          0,
            providerName:        '',
            providerImage:       '',
            providerDescription: '',
            providerLat:         '',
            providerLng:         '',
            idCustomer:          '',
            customerLat:         '',
            customerLng:         '',
            iat:                 0,
            exp:                 0,
        }
    );

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null)
    const menuComponent = useRef<Menu>(null);

    const items = (idProvider: number) => {
        return (
            [
                {
                    label: 'Services',
                    url: `/welcome/providers/services/${idProvider}`,
                    icon: 'pi pi-th-large'
                },
                {
                    label: 'Ratings',
                    url: `/welcome/providers/ratings/${idProvider}`,
                    icon: 'pi pi-comments'
                },
                {
                    label: 'Portofolio',
                    url: `/welcome/providers/portofolio/${idProvider}`,
                    icon: 'pi pi-cloud-upload'
                }
            ]
        )
    }

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        "person.person_name": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'person.lastname': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        "role.description_role": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        profile_state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });

    const getUserAuth = async () => {
        try {
            const response = await getUserAuthenticated();
            if(response.status == 200) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setLoading(true);
        getUserAuth();
        getAllUsers(setUsers, setLoading);
    }, []);

    const formatStatus = (state: boolean) => {
        if(state) {
            return 'Active'
        } else {
            return 'Inactive'
        }
    }

    const getSeverityRoles = (role: string) => {
        switch (role) {
            case "ADMIN":
                return 'text-[#373A85]';

            case "SUPERADMIN":
                return 'text-[#373A85]';

            case "PROVIDER":
                return 'text-[#00CBA4]';

            case "CUSTOMER":
                return 'text-[#109EDA]';
        }
    };

    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div className='w-full flex items-center justify-between'>
                <Link 
                href={'/welcome/users/create'}
                className="px-5 py-2.5 bg-emerald-400 rounded-md border border-emerald-400 text-white text-sm" >
                    Create User
                </Link>
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Search user" className='text-sm rounded-2xl px-6 py-3 opacity-60 shadow-lg text-gray-900/50' />
            </div>
        );
    };
    
    const emptyMessageTemplate = () => {
        return (
            <div className='w-full flex justify-center'>
                <p>No users found.</p>
            </div>
        );
    };
    
    const statusBodyTemplate = (rowData: User) => {
        return (
            <div className={`px-3 py-0.5 rounded-md justify-center items-center gap-2.5 inline-flex ${rowData.profile_state ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`text-xs font-semibold ${rowData.profile_state ? 'text-green-800' : 'text-red-800'}`}>{formatStatus(rowData.profile_state)}</p>
            </div>
        );
    };
    
    const roleBodyTemplate = (rowData: User) => {
        return (
            <p className={`text-xs font-semibold ${getSeverityRoles(rowData.role.role_description)}`}>{rowData.role.role_description}</p>
        );
    };
    
    const actionsBodyTemplate = (rowData: User) => {
        return (
            <div className='flex items-center justify-between gap-3'>
                {
                rowData.profile_state ?
                <>
                    <Tooltip target=".edit-tooltip" />
                    <Link 
                    data-pr-tooltip='Edit'
                    data-pr-position="top"
                    href={`/welcome/users/edit/${rowData.id_profile}`}
                    className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn edit-tooltip'>
                        <i className='pi pi-pencil'></i>
                    </Link>
                    <Button 
                    type='button'
                    outlined
                    icon='pi pi-trash'
                    tooltip='Delete'
                    tooltipOptions={{position: 'top'}}
                    className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn'
                    onClick={() => confirmDelete(Number(rowData.id_profile))} />
                </>
                :
                <Button
                type="button"
                icon="pi pi-check-square"
                outlined
                tooltip='Activate user'
                tooltipOptions={{position: 'top'}}
                className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn'
                onClick={() => confirmActivate(Number(rowData.id_profile))}
                />
            }
            </div>
        );
    };

    const confirmDelete = (idProfile: number) => {
        const accept = async () => {
            setLoading(true)
            const response = await deleteUser(idProfile)
            if(response.status == 200) {
                setLoading(false)
                getAllUsers(setUsers, setLoading);
                toast.current!.show({severity:'success', summary:'Success', detail: `${response.data.msg}`, life: 4000});
            } else {
                setLoading(false)
                toast.current!.show({severity:'error', summary:'Error', detail: `${response.data.msg}`, life: 4000});
            }
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };
    
    const confirmActivate = (idProfile: number) => {
        const accept = async () => {
            setLoading(true)
            activateUser(idProfile, users, setUsers, toast, setLoading)
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to activate this profile?',
            header: 'Activate Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };
    
    const phoneBodyTemplate = (rowData: User) => {
        return <p className={`w-full ${rowData.person.phone == null || rowData.person.phone == '' ? 'text-gray-900/50' : 'text-gray-900'}`}>{rowData.person.phone || 'No phone number'}</p>;
    };

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full p-5'>
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Users</h1>
            <div className='mt-5'>
                <DataTable value={users} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={["person.person_name", 'person.lastname', "role.description_role", 'email', 'phone',  'profile_state']} dataKey="id_profile"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage={emptyMessageTemplate} tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column field="person.person_name" header="First Name" sortable style={{ width: '20%' }}></Column>
                    <Column field='person.lastname' header="Last Name" sortable style={{ width: '20%' }}></Column>
                    <Column field="role.description_role" header="User role" body={roleBodyTemplate} sortable style={{ width: '25%' }}></Column>
                    <Column field="email" header="Email" sortable style={{ width: '15%' }}></Column>
                    <Column field="phone" header="Phone Number" body={phoneBodyTemplate} sortable style={{ width: '5%' }}></Column>
                    <Column field="profile_state" header="Status" body={statusBodyTemplate} sortable style={{ width: '10%' }}></Column>
                    <Column field="actions" body={actionsBodyTemplate} style={{ width: '5%' }}></Column>
                </DataTable>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Index
