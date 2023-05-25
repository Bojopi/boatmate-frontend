import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Boats } from '@/hooks/boats';
import LayoutAdmin from '@/components/layoutAdmin';
import { Boat } from '@/interfaces/interfaces';
import { ButtonDelete, ButtonEdit } from '@/components/buttons/icons';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { ButtonCreate } from '@/components/buttons/link';

const BoatsIndex: React.FC = () => {
    const { getAllBoats, deleteBoat } = Boats();
    
    const [boats, setBoats] = useState<Boat[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        setLoading(true);
        getAllBoats(setBoats, getBoats, setLoading);
        initFilters();
    });

    const getBoats = (data: any) => {
        return [...(data || [])].map((d) => {
            let newDate = new Date();
            newDate.setFullYear(d.year);
            d.year = newDate;

            return d;
        });
    };

    const formatDate = (value: Date) => {
        return value.toLocaleDateString('en-US', {
            year: 'numeric'
        });
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
            lastname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            model: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            brand: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            year: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            length: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

        });
        setGlobalFilterValue('');
    };

    const formatLength = (value: number) => {
        const formatter = new Intl.NumberFormat('en', {
            style: 'unit',
            unit: 'inch'
        })

        return formatter.format(value)
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <ButtonCreate href={'/welcome/boats/create'}>Create Boat</ButtonCreate>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const lengthBodyTemplate = (rowData: Boat) => {
        return formatLength(Number(rowData.length));
    };

    const lengthFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputNumber value={options.value} onChange={(e: any) => options.filterCallback(e.value, options.index)} suffix=' in' locale="en-US" />;
    };

    const dateBodyTemplate = (rowData: any) => {
        return formatDate(rowData.year);
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e: any) => {console.log(e.value); options.filterCallback(e.value, options.index)}} view='year' dateFormat="yy" placeholder="yyyy" mask="9999" />;
    };

    const customerBodyTemplate = (rowData: Boat) => {
        return (
            <div className="flex items-center gap-2">
                <span>{rowData.person_name} {rowData.lastname}</span>
            </div>
        );
    };
    const header = renderHeader();

    const actionsBodyTemplate = (rowData: Boat) => {
        return (
            <div className="flex items-center gap-2">
                <ButtonEdit href={`/welcome/boats/edit/${rowData.id_boat}`} />
                <ButtonDelete onClick={() => confirmDelete(Number(rowData.id_boat))} />
            </div>
        );
    };

    const confirmDelete = (idBoat: number) => {
        const accept = async () => {
            setLoading(true)
            const response = await deleteBoat(idBoat);
            if(response.status == 200) {
                const newList = boats!.filter((item: Boat) => item.id_boat !== idBoat);
                setBoats(newList);
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
    <LayoutAdmin>
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full h-full'>
            <DataTable value={boats!} paginator rows={10} loading={loading} dataKey="id_boat"
                    filters={filters!} globalFilterFields={['person_name', 'lastname', 'type', 'model', 'brand', 'year', 'length', 'boat_position']} header={header}
                    emptyMessage="No boats found." className='min-h-full'>
                <Column field="person_name" header="Customer Name" body={customerBodyTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="type" header="Type Boat" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="model" header="Model Boat" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="brand" header="Brand Boat" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header="Year" filterField='year' dataType='date' style={{ minWidth: '10rem' }} body={dateBodyTemplate} filterElement={dateFilterTemplate} />
                <Column header="Length" filterField="length" dataType="numeric" style={{ minWidth: '10rem' }} body={lengthBodyTemplate} filter filterElement={lengthFilterTemplate} />
                <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default BoatsIndex