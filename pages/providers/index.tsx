import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Providers } from '@/hooks/providers';
import { Provider } from '@/interfaces/provider.interface';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const ProvidersIndex: React.FC = () => {
    const { getAllProviders } = Providers();
    
    const [providers, setProviders] = useState<Provider[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllProviders(setProviders, setLoading);
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
            provider_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            provider_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            zip: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const providerBodyTemplate = (rowData: Provider) => {

        return (
            <div className="flex items-center gap-2">
                {
                rowData.provider_image != null ?
                    <Avatar image={rowData.provider_image} shape="circle" />
                    :
                    <FontAwesomeIcon icon={faCircleUser} className='w-8 h-8' style={{color: "#c2c2c2"}} />
                }
                <span>{rowData.provider_name}</span>
            </div>
        );
    };


  return (
    <div className='w-full '>
        <DataTable value={providers!} paginator showGridlines rows={10} loading={loading} dataKey="id_provider" 
                filters={filters!} globalFilterFields={['provider_name', 'provider_description', 'zip', 'email', 'phone']} header={header}
                emptyMessage="No providers found.">
            <Column field="provider_name" header="Provider Name" body={providerBodyTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
            <Column field="provider_description" header="Description" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
            <Column field="zip" header="Zip Code" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
            <Column field="email" header="Email" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
            <Column field="phone" header="Phone Number" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
        </DataTable>
    </div>
  )
}

export default ProvidersIndex