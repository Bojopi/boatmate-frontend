import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Customers } from '@/hooks/customers';
import { Customer } from '@/interfaces/customer.interface';
import LayoutAdmin from '@/components/layoutAdmin';

const CustomersIndex: React.FC = () => {
    const { getAllCustomers } = Customers();
    
    const [customers, setCustomers] = useState<Customer[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllCustomers(setCustomers, setLoading);
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
            person_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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

    const customerBodyTemplate = (rowData: Customer) => {

        return (
            <div className="flex items-center gap-2">
                <span>{rowData.person_name} {rowData.lastname}</span>
            </div>
        );
    };


  return (
    <LayoutAdmin index={3} sideItem={0}>
        <div className='w-full '>
            <DataTable value={customers!} paginator showGridlines rows={10} loading={loading} dataKey="id_customer" 
                    filters={filters!} globalFilterFields={['person_name', 'email', 'phone']} header={header}
                    emptyMessage="No customers found.">
                <Column field="person_name" header="Customer Name" body={customerBodyTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="email" header="Email" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="phone" header="Phone Number" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default CustomersIndex