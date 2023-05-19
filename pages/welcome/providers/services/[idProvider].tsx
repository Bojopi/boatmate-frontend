import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Providers } from '@/hooks/providers';
import { Provider, ProviderServices } from '@/interfaces/provider.interface';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import LayoutAdmin from '@/components/layoutAdmin';
import Link from 'next/link';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { ButtonCreate } from '@/components/buttons/link';
import { useRouter } from 'next/router';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


const ProviderServicesIndex: React.FC = () => {
    const { getServicesProvider, deleteService } = Providers();
    
    const [services, setServices] = useState<ProviderServices[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);
    
    const router = useRouter();

    useEffect(() => {
        if(router.query.idProvider) {
            getServices(Number(router.query.idProvider));
            initFilters();
        }
    }, []);

    const getServices = async (idProvider: number) => {
        const response = await getServicesProvider(idProvider);
        setServices(response.data.services);
    }

    const formatCurrency = (value: any) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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
            price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <ButtonCreate href={'/welcome/users/create'}>
                    Add Service
                </ButtonCreate>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const priceBodyTemplate = (rowData: ProviderServices) => {
        return formatCurrency(rowData.price);
    };

    const priceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const actionsBodyTemplate = (rowData: ProviderServices) => {
        return (
          <div className="flex items-center">
            <Link href={`/welcome/providers/edit/${rowData.id_service}`}>
                <Button
                type="button"
                icon="pi pi-pencil"
                className="p-button-success"
                text
                tooltip='Edit'
                tooltipOptions={{position: 'top'}}
                />
            </Link>
            <Button
            type="button"
            icon="pi pi-trash"
            className="p-button-danger"
            text
            tooltip='Delete'
            onClick={() => confirmDelete(Number(rowData.id_service))}
            />
          </div>
        );
      };

      const confirmDelete = (idService: number) => {
        const data = {idService: idService};
        const accept = async () => {
            setLoading(true)
            const response = await deleteService(Number(router.query.idProvider), data);
            if(response.status == 200) {
                getServices(Number(router.query.idProvider));
                toast.current!.show({severity:'success', summary:'Success', detail: `${response.data.msg}`, life: 4000});
                setLoading(false);
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
    <LayoutAdmin index={2} sideItem={0}>

        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full '>
            <DataTable value={services!} paginator showGridlines rows={10} loading={loading} dataKey="id_service" 
                    filters={filters!} globalFilterFields={['service_name', 'service_description', 'price']} header={header}
                    emptyMessage="No services found.">
                <Column field="service_name" header="Service Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="service_description" header="Description" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header="Price" filterField="price" dataType="numeric" style={{ minWidth: '10rem' }} body={priceBodyTemplate} filter filterElement={priceFilterTemplate} />
                <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default ProviderServicesIndex