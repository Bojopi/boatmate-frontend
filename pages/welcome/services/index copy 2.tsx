import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Services } from '@/hooks/services';
import LayoutAdmin from '@/components/layoutAdmin';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import Create from './create';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ButtonDelete } from '@/components/buttons/icons';
import { Service } from '@/interfaces/interfaces';

const ServicesIndex: React.FC = () => {
    const { getAllServices, activateService, deleteService } = Services();

    const [services, setServices] = useState<Service[]>([]);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const [statuses] = useState<string[]>(['Active', 'Inactive']);

    useEffect(() => {
        setLoading(true);
        getServices();
        initFilters();
    }, []);

    const getServices = async () => {
        const response = await getAllServices();
        if (response.status === 200) {
            setServices(response.data.services);
        }
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
            service_state: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                {/* <Create idService={0} services={services} setServices={setServices} toast={toast} setLoading={setLoading} /> */}
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const statusBodyTemplate = (rowData: Service) => {
        if(rowData.service_state) {
            return <Tag value={'Active'} rounded severity={getSeverity(rowData.service_state)} />;
        } else {
            return <Tag value={'Inactive'} rounded severity={getSeverity(rowData.service_state)} />;
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

    const categoryBodyTemplate = (rowData: Service) => {
        if(rowData.service_categories!.length > 0) {
            const firstElement = rowData.service_categories![0];
            return (
                <div className='text-sm text-gray-600'>{
                    firstElement?.category.category_name}
                    {(rowData.service_categories!.length - 1) != 0 ? ` and +${rowData.service_categories!.length -1} more...` : null}</div>
            )
        } else {
            return (
                <div className='text-sm text-gray-600'>No categories assigned</div>
            )
        }
    }

    const actionsBodyTemplate = (rowData: Service) => {
        return (
            <div className="flex items-center gap-2">
                {
                    rowData.service_state ?
                    <>
                        {/* <Create idService={Number(rowData.id_service)} services={services} setServices={setServices} toast={toast} setLoading={setLoading}  /> */}
                        <ButtonDelete
                        onClick={() => confirmDelete(Number(rowData.id_service))}
                        />
                    </>
                    :
                    <Button
                    type="button"
                    icon="pi pi-check-square"
                    className="p-button-help"
                    text
                    tooltip='Activate Service'
                    tooltipOptions={{position: 'top'}}
                    onClick={() => confirmActivate(Number(rowData.id_service))}
                    />
                }
            </div>
        );
    };

    const confirmDelete = (idService: number) => {
        const accept = async () => {
            setLoading(true)
            deleteService(idService, services, setServices, toast, setLoading);
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to delete this service?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    const confirmActivate = (idService: number) => {
        const accept = async () => {
            setLoading(true)
            activateService(idService, services, setServices, toast, setLoading)
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to activate this service?',
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
            <DataTable value={services!} paginator rows={10} loading={loading} dataKey="id_service"
                    filters={filters!} globalFilterFields={['service_name', 'service_description', 'service_state']} header={header}
                    emptyMessage="No services found."
                    className='min-h-full'>
                <Column field="service_name" header="Service Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="service_description" header="Description" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="service_state" header="State" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column header='Categories' body={categoryBodyTemplate} style={{ width: '10rem' }} />
                <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default ServicesIndex