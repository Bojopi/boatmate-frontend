import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Roles } from '@/hooks/roles';
import { Role } from '@/interfaces/roles.interface';

const RolesIndex: React.FC = () => {
    const {getAllRoles} = Roles();
    
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [rolesList] = useState<string[]>(['ADMIN', 'SUPERADMIN', 'PROVIDER', 'CUSTOMER']);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllRoles(setRoles, setLoading);
        initFilters();
    }, []);
    
    const getSeverityRoles = (role: string) => {
        switch (role) {
            case "ADMIN":
                return 'bg-[#0ea5e9]';

            case "SUPERADMIN":
                return 'bg-[#eab308]';

            case "PROVIDER":
                return 'bg-[#a855f7]';

            case "CUSTOMER":
                return 'bg-[#f43f5e]';
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
            role_description: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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

    const rolesFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={rolesList} onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)} itemTemplate={rolesItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const rolesItemTemplate = (option: string) => {
        return <Tag value={option} className={getSeverityRoles(option)} />;
    };


  return (
    <div className='w-full '>
        <DataTable value={roles!} paginator showGridlines rows={10} loading={loading} dataKey="id_role" 
                filters={filters!} globalFilterFields={['role_description']} header={header}
                emptyMessage="No roles found.">
            <Column field="role_description" header="Role" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} filter filterElement={rolesFilterTemplate} />
        </DataTable>
    </div>
  )
}

export default RolesIndex