import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
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


const ProviderServicesIndex: React.FC = () => {
    const { getServicesProvider, deleteService } = Providers();
    
    const [services, setServices] = useState<ProviderServices[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const [statuses] = useState<string[]>(['Active', 'Inactive']);
    
    const router = useRouter();

    useEffect(() => {
        if(router.query.idProvider) {
            setLoading(true);
            getServices(Number(router.query.idProvider));
            initFilters();
        }
    }, [router.query.idProvider]);

    const getServices = async (idProvider: number) => {
        const response = await getServicesProvider(idProvider);
        setServices(response.data.services);
        setLoading(false);
    }

    const getSeverity = (state: boolean) => {
        switch (state) {
            case false:
                return 'danger';

            case true:
                return 'success';
        }
    };

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
        return (
            <div className="flex justify-between">
                <Create
                idProvider={Number(router.query.idProvider)}
                serviceList={services} 
                setServiceList={setServices}
                toast={toast}
                loading={loading}
                setLoading={setLoading} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const statusBodyTemplate = (rowData: ProviderServices) => {
        if(rowData.service_provider_state) {
            return <Tag value={'Active'} rounded severity={getSeverity(rowData.service_provider_state)} />;
        } else {
            return <Tag value={'Inactive'} rounded severity={getSeverity(rowData.service_provider_state)} />;
        }
    };

    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option: string) => {
        if(option == 'Active') {
            return <Tag value={option} severity={getSeverity(true)} />;
        } else {
            return <Tag value={option} severity={getSeverity(false)} />;
        }
    };

    const actionsBodyTemplate = (rowData: ProviderServices) => {
        return (
          <div className="flex items-center">
            <Edit 
            idProvider={Number(router.query.idProvider)} 
            idService={Number(rowData.id_service)} 
            serviceList={services} 
            setServiceList={setServices}
            toast={toast}
            loading={loading}
            setLoading={setLoading} />
            <ButtonDelete onClick={() => confirmDelete(Number(rowData.id_service))} />
          </div>
        );
      };

      const paginator = {
        layout: 'RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
        RowsPerPageDropdown: () => {
            return (
                <div className="flex">
                    <Link href={'/welcome/providers'} >
                        <BackAnimated></BackAnimated>
                    </Link>
                </div>
            );
        },
        CurrentPageReport: (options: any) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            );
        }
    };

      const descriptionTemplate = (rowData: ProviderServices) => {
        return (
            <p className={rowData.service_provider_description ? 'line-clamp-2' : 'text-gray-400'}>{rowData.service_provider_description ? rowData.service_provider_description : 'No description'}</p>
        )
      }

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
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };


  return (
    <LayoutAdmin>
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full h-full'>
            <DataTable value={services!} paginator paginatorTemplate={paginator} rows={10} loading={loading} dataKey="id_service" 
                    filters={filters!} globalFilterFields={['service_name', 'service_provider_description', 'service_provider_state']} header={header}
                    emptyMessage="No services found."
                    className='min-h-full'>
                <Column field="service_name" header="Service Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="service_provider_description" header="Description" body={descriptionTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="service_provider_state" header="State" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default ProviderServicesIndex