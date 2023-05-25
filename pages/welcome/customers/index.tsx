import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Customers } from '@/hooks/customers';
import LayoutAdmin from '@/components/layoutAdmin';
import { Customer } from '@/interfaces/interfaces';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Users } from '@/hooks/user';

const CustomersIndex: React.FC = () => {
    const { getAllCustomers } = Customers();
    const {activateUser} = Users();

    const [customers, setCustomers] = useState<Customer[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [statuses] = useState<string[]>(['Active', 'Inactive']);

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        setLoading(true)
        getCustomers();
        initFilters();
    });

    const getCustomers = async () => {
        const response = await getAllCustomers();
        setCustomers(response.data.customers);
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
                <Button type="button" icon="pi pi-filter-slash" className='p-button-success' label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const statusBodyTemplate = (rowData: Customer) => {
        if(rowData.profile_state) {
            return <Tag value={'Active'} rounded severity={getSeverity(rowData.profile_state)} />;
        } else {
            return <Tag value={'Inactive'} rounded severity={getSeverity(rowData.profile_state)} />;
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

    const customerBodyTemplate = (rowData: Customer) => {

        return (
            <div className="flex items-center gap-2">
                <span>{rowData.person_name} {rowData.lastname}</span>
            </div>
        );
    };

    const actionsBodyTemplate = (rowData: Customer) => {
        return (
            <div className="flex items-center gap-2">
            {
                !rowData.profile_state ?
                    <Button
                    type="button"
                    icon="pi pi-check-square"
                    className="p-button-help"
                    text
                    tooltip='Activate user'
                    tooltipOptions={{position: 'top'}}
                    onClick={() => confirmActivate(Number(rowData.id_profile))}
                    />
                : null
            }
            </div>
        );
    };

    const confirmActivate = (idCustomer: number) => {
        const accept = async () => {
            setLoading(true)
            activateUser(idCustomer, customers, setCustomers, toast, setLoading);
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


  return (
    <LayoutAdmin>
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full h-full'>
            <DataTable value={customers!} paginator rows={10} loading={loading} dataKey="id_customer"
                    filters={filters!} globalFilterFields={['person_name', 'email', 'phone']} header={header}
                    emptyMessage="No customers found." className='min-h-full'>
                <Column field="person_name" header="Customer Name" body={customerBodyTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="email" header="Email" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="phone" header="Phone Number" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="state" header="State" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default CustomersIndex