import LayoutAdmin from '@/components/layoutAdmin';
import { Auth } from '@/hooks/auth';
import { Profile, Service } from '@/interfaces/interfaces';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState, useRef } from 'react';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Services } from '@/hooks/services';
import Create from './create';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// import View from './view'

const Index = () => {
    const { getAllServices, activateService, deleteService } = Services();
    const { getUserAuthenticated } = Auth();

    const [services, setServices] = useState<Service[]>([]);
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

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        service_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        service_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        service_state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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

    const getServices = async () => {
        try {
            const response = await getAllServices();
            if (response.status == 200) {
                setServices(response.data.services);
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setLoading(true);
        getUserAuth();
        getServices();
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
                <Create 
                idService={0} 
                services={services} 
                setServices={setServices} 
                toast={toast} 
                loading={loading}
                setLoading={setLoading} />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Search user" className='text-sm rounded-2xl px-6 py-3 opacity-60 shadow-lg text-gray-900/50' />
            </div>
        );
    };
    
    const emptyMessageTemplate = () => {
        return (
            <div className='w-full flex justify-center'>
                <p>No services found.</p>
            </div>
        );
    };
    
    const statusBodyTemplate = (rowData: Service) => {
        return (
            <div className={`px-3 py-0.5 rounded-md justify-center items-center gap-2.5 inline-flex ${rowData.service_state ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`text-xs font-semibold ${rowData.service_state ? 'text-green-800' : 'text-red-800'}`}>{formatStatus(rowData.service_state)}</p>
            </div>
        );
    };
    
    const actionsBodyTemplate = (rowData: Service) => {
        return (
            <div className='flex items-center justify-between gap-3'>
                {
                    rowData.service_state ?
                    <>
                        <Create 
                        idService={Number(rowData.id_service)} 
                        services={services} 
                        setServices={setServices} 
                        toast={toast} 
                        loading={loading}
                        setLoading={setLoading}  />
                        <Button 
                        type="button" 
                        icon='pi pi-trash' 
                        outlined 
                        tooltip='Delete' 
                        tooltipOptions={{position: 'top' }}
                        className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn'
                        onClick={() => confirmDelete(Number(rowData.id_service))}
                        />
                    </>
                    :
                    <Button
                    type="button"
                    icon="pi pi-eye"
                    outlined
                    tooltip='Activate Service'
                    tooltipOptions={{position: 'top'}}
                    className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn'
                    onClick={() => confirmActivate(Number(rowData.id_service))}
                    />
                }
            </div>
        );
    };

    const confirmDelete = (idService: number) => {
        const accept = async () => {
            setLoading(true)
            deleteService(idService, services, setServices, toast, setLoading);
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to delete this service?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    const confirmActivate = (idService: number) => {
        const accept = async () => {
            setLoading(true)
            activateService(idService, services, setServices, toast, setLoading)
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to activate this service?',
            header: 'Activate Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    const descriptionBodyTemplate = (rowData: Service) => {
        return <p className={`w-full line-clamp-3 ${rowData.service_description == null || rowData.service_description == '' ? 'text-gray-900/50' : 'text-gray-900'}`}>{rowData.service_description || 'No description'}</p>;
    };

    const categoryBodyTemplate = (rowData: Service) => {
        if(rowData.service_categories!.length > 0) {
            const firstElement = rowData.service_categories![0];
            return (
                <div className='text-sm text-gray-600'>{
                    firstElement?.category.category_name}
                    {(rowData.service_categories!.length - 1) != 0 ? ` and +${rowData.service_categories!.length -1} more...` : null}</div>
            )
        } else {
            return (
                <div className='text-sm text-gray-600'>No categories assigned</div>
            )
        }
    }

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full p-5'>
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Services</h1>
            <div className='mt-5'>
                <DataTable value={services} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={['service_name', 'service_description', 'service_state']} dataKey="id_service"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage={emptyMessageTemplate} tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column field="service_name" header="Service Name" sortable style={{ width: '25%' }}></Column>
                    <Column field="service_description" header="Description" body={descriptionBodyTemplate} sortable style={{ width: '25%' }}></Column>
                    <Column header='Categories' body={categoryBodyTemplate} style={{ width: '25%' }} />
                    <Column field="service_state" header="Status" body={statusBodyTemplate} sortable style={{ width: '20%' }}></Column>
                    <Column field="actions" body={actionsBodyTemplate} style={{ width: '5%' }}></Column>
                </DataTable>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Index
