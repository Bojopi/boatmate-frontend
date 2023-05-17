import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Roles } from '@/hooks/roles';
import { Role } from '@/interfaces/roles.interface';
import LayoutAdmin from '@/components/layoutAdmin';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Spinner from '@/components/spinner';
import Link from 'next/link';
import { ButtonCreate } from '@/components/buttons/link';
import Create from './create';

const Index: React.FC = () => {
    const {getAllRoles, deleteRole} = Roles();
    
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [rolesList] = useState<string[]>(['ADMIN', 'SUPERADMIN', 'PROVIDER', 'CUSTOMER']);

    const [loading, setLoading] = useState<boolean>(false);


    const toast = useRef<Toast>(null);

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
                <Create idRole={0} roles={roles} setRoles={setRoles} toast={toast} setLoading={setLoading} />
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

    const actionsBodyTemplate = (rowData: Role) => {
        return (
          <div className="flex items-center gap-2">
            <Create idRole={rowData.id_role} roles={roles} setRoles={setRoles} toast={toast} setLoading={setLoading} />
            <Button
              type="button"
              icon="pi pi-trash"
              className="p-button-danger"
              text
              tooltip='Delete'
              onClick={() => confirmDelete(Number(rowData.id_role))}
            />
          </div>
        );
      };

      const confirmDelete = (idRole: number) => {
        const accept = async () => {
            setLoading(true)
            const response = await deleteRole(idRole)
            if(response.status == 200) {
                setLoading(false)
                getAllRoles(setRoles, setLoading);
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
    <LayoutAdmin index={1} sideItem={1}>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full '>
            <DataTable value={roles!} paginator showGridlines rows={10} loading={loading} dataKey="id_role" 
                    filters={filters!} globalFilterFields={['role_description']} header={header}
                    emptyMessage="No roles found.">
                <Column field="role_description" header="Role" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} filter filterElement={rolesFilterTemplate} />
                <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default Index