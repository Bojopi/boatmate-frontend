import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Users } from '@/hooks/user';
import { User } from '../../interfaces/users.interface';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const UsersIndex: React.FC = () => {
    const {getAllUsers} = Users();

    const [users, setUsers] = useState<User[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [statuses] = useState<string[]>(['Active', 'Inactive']);
    const [roles] = useState<string[]>(['ADMIN', 'SUPERADMIN', 'PROVIDER', 'CUSTOMER']);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllUsers(setUsers, setLoading);
        initFilters();
    }, []);

    const getSeverity = (state: boolean) => {
        switch (state) {
            case false:
                return 'danger';

            case true:
                return 'success';
        }
    };

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
            "person.name": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'person.lastname': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            "role.description_role": { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            state: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
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

    const userBodyTemplate = (rowData: User) => {
        const user = rowData.person;

        return (
            <div className="flex items-center gap-2">
                {
                user.person_image != null ?
                    <Avatar image={user.person_image} shape="circle" />
                    :
                    <FontAwesomeIcon icon={faCircleUser} className='w-8 h-8' style={{color: "#c2c2c2"}} />
                }
                <span>{user.person_name}</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData: User) => {
        if(rowData.profile_state) {
            return <Tag value={'Active'} severity={getSeverity(rowData.profile_state)} />;
        } else {
            return <Tag value={'Inactive'} severity={getSeverity(rowData.profile_state)} />;
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

    const rolesBodyTemplate = (rowData: User) => {
        return <Tag value={rowData.role.role_description} className={getSeverityRoles(rowData.role.role_description)} />;
    };

    const rolesFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={roles} onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)} itemTemplate={rolesItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const rolesItemTemplate = (option: string) => {
        return <Tag value={option} className={getSeverityRoles(option)} />;
    };


  return (
    <div className='w-full '>
        <DataTable value={users!} paginator showGridlines rows={10} loading={loading} dataKey="id_profile"
                filters={filters!} globalFilterFields={['person.name', 'person.lastname', 'role.description_role', 'email', 'state']} header={header}
                emptyMessage="No users found.">
            <Column field="person.name" header="Name" body={userBodyTemplate} filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
            <Column field="person.lastname" header="Lastname" filter filterPlaceholder="Search by lastname" style={{ minWidth: '12rem' }} />
            <Column field="role.description_role" header="Role" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={rolesBodyTemplate} filter filterElement={rolesFilterTemplate} />
            <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
            <Column field="state" header="State" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
        </DataTable>
    </div>
  )
}

export default UsersIndex