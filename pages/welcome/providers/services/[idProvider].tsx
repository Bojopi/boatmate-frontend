import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Providers } from '@/hooks/providers';
import LayoutAdmin from '@/components/layoutAdmin';
import Link from 'next/link';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/router';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { BackAnimated } from '@/components/buttons/animated';
import Edit from './edit';
import Create from './create';
import { ButtonDelete } from '@/components/buttons/icons';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ProviderServices } from '@/interfaces/interfaces';
import { AiFillEye } from 'react-icons/ai';
import { Button } from 'primereact/button';
import { generateBreadcrumbItems } from '@/functions/breadcrumb';
import { BreadCrumb } from 'primereact/breadcrumb';
import Spinner from '@/components/spinner';


const ProviderServicesIndex: React.FC = () => {
    const { getServicesProvider, deleteService, show } = Providers();
    
    const [providerName, setProviderName] = useState<string>('No name');
    const [services, setServices] = useState<ProviderServices[]>([]);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);
    
    const router = useRouter();

    const home = {icon: 'pi pi-home'}

    const breadcrumbItems = [
        ...generateBreadcrumbItems(router.asPath)
    ];

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        service_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        service_provider_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        service_provider_state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });

    const showName = async (idProvider: number) => {
        try {
            const response = await show(idProvider);
            if(response.status == 200) {
                setProviderName(response.data.provider.provider_name || 'No name');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(router.query.idProvider) {
            setLoading(true);
            getServices(Number(router.query.idProvider));
            showName(Number(router.query.idProvider));
            initFilters();
        }
    }, [router.query.idProvider]);

    const getServices = async (idProvider: number) => {
        const response = await getServicesProvider(idProvider);
        setServices(response.data.services);
        setLoading(false);
    }

    const formatStatus = (state: boolean) => {
        if(state) {
            return 'Active'
        } else {
            return 'Inactive'
        }
    }

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            service_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            service_provider_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            service_provider_state: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div className='w-full flex justify-between'>
                <Create
                idProvider={Number(router.query.idProvider)}
                serviceList={services} 
                setServiceList={setServices}
                toast={toast}
                loading={loading}
                setLoading={setLoading} />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Search service" className='text-sm rounded-2xl px-6 py-3 opacity-60 shadow-lg text-gray-900/50' />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: ProviderServices) => {
        return (
            <div className={`px-3 py-0.5 rounded-md justify-center items-center gap-2.5 inline-flex ${rowData.service_provider_state ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`text-xs font-semibold ${rowData.service_provider_state ? 'text-green-800' : 'text-red-800'}`}>{formatStatus(rowData.service_provider_state)}</p>
            </div>
        );
    };

    const actionsBodyTemplate = (rowData: ProviderServices) => {
        return (
          <div className="flex items-center justify-between gap-3">
            <Edit 
            idProvider={Number(router.query.idProvider)} 
            idService={Number(rowData.id_service)} 
            serviceList={services} 
            setServiceList={setServices}
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
            onClick={() => confirmDelete(Number(rowData.id_service))} />
          </div>
        );
    };


    const descriptionBodyTemplate = (rowData: ProviderServices) => {
        return <p className={`w-full line-clamp-3 ${rowData.service_provider_description == null || rowData.service_provider_description == '' ? 'text-gray-900/50' : 'text-gray-900'}`}>{rowData.service_provider_description || 'No description'}</p>;
    };

    const confirmDelete = (idService: number) => {
        const accept = async () => {
            setLoading(true)
            const response = await deleteService(Number(router.query.idProvider), idService);
            if(response.status == 200) {
                getServices(Number(router.query.idProvider));
                toast.current!.show({severity:'success', summary:'Success', detail: `${response.data.msg}`, life: 4000});
                setLoading(false);
            } else {
                setLoading(false)
                toast.current!.show({severity:'error', summary:'Error', detail: `${response.data.msg}`, life: 4000});
            }
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to delete this service of provider?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    const emptyMessageTemplate = () => {
        return (
            <div className='w-full flex justify-center'>
                <p>No services found.</p>
            </div>
        );
    };


  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full p-5'>
            <BreadCrumb model={breadcrumbItems} home={home} className='border-none' />
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Services of {providerName}</h1>
            <div className='mt-5'>
                <DataTable value={services} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={['service_name', 'service_provider_description', 'service_state']} dataKey="id_service_provider"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage={emptyMessageTemplate} tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column field="service_name" header="Service Name" sortable style={{ width: '25%' }}></Column>
                    <Column field="service_provider_description" header="Description" body={descriptionBodyTemplate} sortable style={{ width: '25%' }}></Column>
                    <Column field="service_state" header="Status" body={statusBodyTemplate} sortable style={{ width: '20%' }}></Column>
                    <Column field="actions" body={actionsBodyTemplate} style={{ width: '5%' }}></Column>
                </DataTable>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default ProviderServicesIndex