import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Providers } from '@/hooks/providers';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import LayoutAdmin from '@/components/layoutAdmin';
import Link from 'next/link';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Users } from '@/hooks/user';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ButtonEdit } from '@/components/buttons/icons';
import { Provider } from '@/interfaces/interfaces';

const ProvidersIndex: React.FC = () => {
    const { getAllProviders } = Providers();
    const { activateUser } = Users();
    
    const [providers, setProviders] = useState<Provider[]>([]);
    const [filters, setFilters] = useState<any>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const [statuses] = useState<string[]>(['Active', 'Inactive']);

    useEffect(() => {
        setLoading(true);
        getAllProviders(setProviders, setLoading);
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
            profile_state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            person_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            lastname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined className='p-button-success' onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const statusBodyTemplate = (rowData: Provider) => {
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

    const ownerBodyTemplate = (rowData: Provider) => {
        return (
            <p>{rowData.person_name} {rowData.lastname}</p>
        )
    }

    const actionsBodyTemplate = (rowData: Provider) => {
        return (
          <div className="flex items-center">
            {
                rowData.profile_state ?
                <>
                    <ButtonEdit href={`/welcome/providers/edit/${rowData.id_provider}`} />
                    <Link href={`/welcome/providers/services/${rowData.id_provider}`}>
                        <Button
                        type="button"
                        icon="pi pi-th-large"
                        className="p-button-warning"
                        text
                        tooltip='Services'
                        tooltipOptions={{position: 'top'}}
                        />
                    </Link>
                    <Link href={`/welcome/providers/ratings/${rowData.id_provider}`}>
                        <Button
                        type="button"
                        icon="pi pi-comments"
                        className="text-teal-700"
                        text
                        tooltip='Ratings'
                        tooltipOptions={{position: 'top'}}
                        />
                    </Link>
                    <Link href={`/welcome/providers/portofolio/${rowData.id_provider}`}>
                        <Button
                        type="button"
                        icon="pi pi-cloud-upload"
                        className="text-pink-400"
                        text
                        tooltip='Portofolio'
                        tooltipOptions={{position: 'top'}}
                        />
                    </Link>
                </>
                :
                <Button
                type="button"
                icon="pi pi-check-square"
                className="p-button-help"
                text
                tooltip='Activate provider'
                tooltipOptions={{position: 'top'}}
                onClick={() => confirmActivate(Number(rowData.id_profile))}
                />
            }
          </div>
        );
      };

      const confirmActivate = (idProfile: number) => {
        const accept = async () => {
            setLoading(true)
            activateUser(idProfile, providers, setProviders, toast, setLoading)
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to activate this provider?',
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
            <DataTable value={providers!} paginator rows={10} loading={loading} dataKey="id_provider" 
                    filters={filters!} globalFilterFields={['provider_name', 'person_name', 'lastname', 'provider_description', 'profile_state', 'email', 'phone']} header={header}
                    emptyMessage="No providers found."
                    className='min-h-full'>
                <Column field="provider_name" header="Provider Name" body={providerBodyTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="person_name" header="Owner's name" body={ownerBodyTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="provider_description" header="Description" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="profile_state" header="State" filterMenuStyle={{ width: '6rem' }} style={{ minWidth: '6rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column field="email" header="Email" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="phone" header="Phone" filter filterMenuStyle={{ width: '10rem' }} style={{ minWidth: '10rem' }} />
                <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default ProvidersIndex