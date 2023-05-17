import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Customers } from '@/hooks/customers';
import { ServiceHistoryElement } from '@/interfaces/serviceHistory.interface';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import LayoutAdmin from '@/components/layoutAdmin';

const ServiceHistoryIndex: React.FC = () => {
    const { getServiceHistory } = Customers();
    
    const [serviceHistory, setServiceHistory] = useState<ServiceHistoryElement[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const [states] = useState<string[]>(['APPROVED', 'PENDING', 'CANCELED']);

    const getSeverity = (status: string) => {
        switch (status) {
            case 'CANCELED':
                return 'danger';

            case 'APPROVED':
                return 'success';

            case 'PENDING':
                return 'warning';
        }
    };

    useEffect(() => {
        getServiceHistory(setServiceHistory, getServicesHistories, setLoading);
        initFilters();
    }, []);

    const getServicesHistories = (data: any) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);

            return d;
        });
    };

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
            provider_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            person_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            lastname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            contract_state: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            contract_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

        });
        setGlobalFilterValue('');
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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

    const priceBodyTemplate = (rowData: ServiceHistoryElement) => {
        return formatCurrency(rowData.price);
    };

    const priceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputNumber value={options.value} onChange={(e: any) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const stateBodyTemplate = (rowData: ServiceHistoryElement) => {
        return <Tag value={rowData.contract_state} severity={getSeverity(rowData.contract_state)} />;
    };

    const stateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={states} onChange={(e: any) => options.filterCallback(e.value, options.index)} itemTemplate={stateItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const stateItemTemplate = (option: string) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const dateBodyTemplate = (rowData: any) => {
        return formatDate(rowData.date);
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e: any) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const customerBodyTemplate = (rowData: ServiceHistoryElement) => {
        return (
            <div className="flex items-center gap-2">
                <span>{rowData.person_name} {rowData.lastname}</span>
            </div>
        );
    };
    const header = renderHeader();



  return (
    <LayoutAdmin index={2} sideItem={3}>
        <div className='w-full '>
            <DataTable value={serviceHistory!} paginator showGridlines rows={10} loading={loading} dataKey="id_contract" 
                    filters={filters!} globalFilterFields={['service_name', 'provider_name', 'person_name', 'lastname', 'price', 'date', 'contract_state', 'contract_description']} header={header}
                    emptyMessage="No Service History found.">
                <Column field="service_name" header="Service Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="provider_name" header="Provider Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="person_name" header="Customer Name" body={customerBodyTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header="Price" filterField="price" dataType="numeric" style={{ minWidth: '10rem' }} body={priceBodyTemplate} filter filterElement={priceFilterTemplate} />
                <Column header="Date" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                <Column field="contract_state" header="Contract State" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={stateBodyTemplate} filter filterElement={stateFilterTemplate} />
                <Column field="contract_description" header="Detail Service" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default ServiceHistoryIndex