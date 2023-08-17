import LayoutAdmin from '@/components/layoutAdmin';
import { Auth } from '@/hooks/auth';
import { Profile, Role } from '@/interfaces/interfaces';
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
import { Roles } from '@/hooks/roles';
import Create from './create';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// import View from './view'

const Index = () => {
    const {getAllRoles, deleteRole, activateRole} = Roles();
    const { getUserAuthenticated } = Auth();

    const [roles, setRoles] = useState<Role[]>([]);
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
        role_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        role_state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
        getAllRoles(setRoles, setLoading);
    }, []);

    const formatStatus = (state: boolean) => {
        if(state) {
            return 'Active'
        } else {
            return 'Inactive'
        }
    }

    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div className='w-full flex justify-between'>
                <Create idRole={0} roles={roles} setRoles={setRoles} toast={toast} loading={loading} setLoading={setLoading} />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Search user" className='text-sm rounded-2xl px-6 py-3 opacity-60 shadow-lg text-gray-900/50' />
            </div>
        );
    };
    
    const emptyMessageTemplate = () => {
        return (
            <div className='w-full flex justify-center'>
                <p>No roles found.</p>
            </div>
        );
    };
    
    const statusBodyTemplate = (rowData: Role) => {
        return (
            <div className={`px-3 py-0.5 rounded-md justify-center items-center gap-2.5 inline-flex ${rowData.role_state ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`text-xs font-semibold ${rowData.role_state ? 'text-green-800' : 'text-red-800'}`}>{formatStatus(rowData.role_state)}</p>
            </div>
        );
    };
    
    const actionsBodyTemplate = (rowData: Role) => {
        return (
            <div className='flex items-center justify-between gap-3'>
                {
                rowData.role_state ?
                <>
                    <Create 
                    idRole={rowData.id_role} 
                    roles={roles} 
                    setRoles={setRoles} 
                    toast={toast} 
                    loading={loading}
                    setLoading={setLoading} />
                    <Button 
                    type="button" 
                    icon='pi pi-trash' 
                    outlined 
                    tooltip='Delete' 
                    tooltipOptions={{position: 'top' }}
                    className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn'
                    onClick={() => confirmDelete(Number(rowData.id_role))} />
                </>
                :
                    <Button
                    type="button"
                    icon="pi pi-check-square"
                    outlined
                    tooltip='Activate role'
                    tooltipOptions={{position: 'top'}}
                    className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn'
                    onClick={() => confirmActivate(Number(rowData.id_role))}
                    />
            }
            </div>
        );
    };

    const confirmDelete = (idRole: number) => {
        const accept = async () => {
            setLoading(true)
            deleteRole(idRole, roles, setRoles, toast, setLoading);
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

    const confirmActivate = (idRole: number) => {
        const accept = async () => {
            setLoading(true)
            activateRole(idRole, roles, setRoles, toast, setLoading)
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to activate this role?',
            header: 'Activate Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full p-5'>
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Roles</h1>
            <div className='mt-5'>
                <DataTable value={roles} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={["description_role", 'role_state']} dataKey="id_role"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage={emptyMessageTemplate} tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column field="role_description" header="Role Name" sortable style={{ width: '55%' }}></Column>
                    <Column field="role_state" header="Status" body={statusBodyTemplate} sortable style={{ width: '40%' }}></Column>
                    <Column field="actions" body={actionsBodyTemplate} style={{ width: '5%' }}></Column>
                </DataTable>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Index
