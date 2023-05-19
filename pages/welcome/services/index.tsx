import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Services } from '@/hooks/services';
import { Service } from '@/interfaces/serviceCategories.interface';
import LayoutAdmin from '@/components/layoutAdmin';
import { ButtonCreate } from '@/components/buttons/link';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import Spinner from '@/components/spinner';
import Link from 'next/link';

const ServicesIndex: React.FC = () => {
    const { getAllServices } = Services();
    
    const [services, setServices] = useState<Service[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        getAllServices(setServices, setLoading);
        initFilters();
    }, []);

    const clearFilter = () => {
        initFilters();
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
            service_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <ButtonCreate href={'/welcome/users/create'}>
                    Create Service
                </ButtonCreate>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const actionsBodyTemplate = (rowData: Service) => {
        return (
            <div className="flex items-center gap-2">
                <Link href={`/welcome/users/edit/${rowData.id_service}`}>
                    <Button
                    type="button"
                    icon="pi pi-pencil"
                    className="p-button-success"
                    text
                    tooltip='Edit'
                    />
                </Link>
            </div>
        );
    };


  return (
    <LayoutAdmin index={2} sideItem={1}>

    <Spinner loading={loading} />
    <Toast ref={toast} />
    <ConfirmDialog />
        <div className='w-full '>
            <DataTable value={services!} paginator showGridlines rows={10} loading={loading} dataKey="id_service" 
                    filters={filters!} globalFilterFields={['service_name', 'service_description']} header={header}
                    emptyMessage="No services found.">
                <Column field="service_name" header="Service Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="service_description" header="Description" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default ServicesIndex