import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Users } from '@/hooks/user';
import { User } from '../../../interfaces/users.interface';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import CreateUser from './create';
import LayoutAdmin from '@/components/layoutAdmin';
import { ButtonCreate } from '@/components/buttons/link';
import Link from 'next/link';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Spinner from '@/components/spinner';

const UsersIndex: React.FC = () => {
    const {getAllUsers, deleteUser} = Users();

    const [users, setUsers] = useState<User[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [statuses] = useState<string[]>(['Active', 'Inactive']);
    const [roles] = useState<string[]>(['ADMIN', 'SUPERADMIN', 'PROVIDER', 'CUSTOMER']);

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

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
            "person.person_name": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
                <ButtonCreate href={'/welcome/users/create'}>
                    Create User
                </ButtonCreate>
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

    const rolesBodyTemplate = (rowData: User) => {
        return <Tag value={rowData.role.role_description} className={getSeverityRoles(rowData.role.role_description)} />;
    };

    const rolesFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={roles} onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)} itemTemplate={rolesItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const rolesItemTemplate = (option: string) => {
        return <Tag value={option} className={getSeverityRoles(option)} />;
    };

    const actionsBodyTemplate = (rowData: User) => {
        return (
          <div className="flex items-center gap-2">
            {
                rowData.profile_state ?
                <>
                <Link href={`/welcome/users/edit/${rowData.id_profile}`}>
                    <Button
                    type="button"
                    icon="pi pi-pencil"
                    className="p-button-success"
                    text
                    tooltip='Edit'
                    />
                </Link>

                <Button
                type="button"
                icon="pi pi-trash"
                className="p-button-danger"
                text
                tooltip='Delete'
                onClick={() => confirmDelete(Number(rowData.id_profile))}
                />
                </>
                : null
            }
          </div>
        );
      };

      const confirmDelete = (idProfile: number) => {
        const accept = async () => {
            setLoading(true)
            const response = await deleteUser(idProfile)
            if(response.status == 200) {
                setLoading(false)
                getAllUsers(setUsers, setLoading);
                toast.current!.show({severity:'success', summary:'Success', detail: `${response.data.msg}`, life: 4000});
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
    <LayoutAdmin index={1} sideItem={0}>
    <Spinner loading={loading} />
    <Toast ref={toast} />
    <ConfirmDialog />
    <div className='w-full '>
        <DataTable value={users!} paginator showGridlines rows={10} loading={loading} dataKey="id_profile"
                filters={filters!} globalFilterFields={['person.person_name', 'person.lastname', 'role.description_role', 'email', 'state']} header={header}
                emptyMessage="No users found.">
            <Column field="person.person_name" header="Name" body={userBodyTemplate} filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
            <Column field="person.lastname" header="Lastname" filter filterPlaceholder="Search by lastname" style={{ minWidth: '12rem' }} />
            <Column field="role.description_role" header="Role" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={rolesBodyTemplate} filter filterElement={rolesFilterTemplate} />
            <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
            <Column field="state" header="State" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
            <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
        </DataTable>
    </div>
    </LayoutAdmin>
  )
}

export default UsersIndex