import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Boats } from '@/hooks/boats';
import { Boat } from '@/interfaces/boat.interface';
import LayoutAdmin from '@/components/layoutAdmin';

const BoatsIndex: React.FC = () => {
    const { getAllBoats } = Boats();
    
    const [boats, setBoat] = useState<Boat[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllBoats(setBoat, getBoats, setLoading);
        initFilters();
    }, []);

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
            // day: '2-digit',
            // month: '2-digit',
            year: 'numeric'
        });
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
            lastname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            model: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            brand: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            year: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            length: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            boat_position: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

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
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
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



  return (
    <LayoutAdmin index={3} sideItem={1}>
        <div className='w-full '>
            <DataTable value={boats!} paginator showGridlines rows={10} loading={loading} dataKey="id_boat"
                    filters={filters!} globalFilterFields={['person_name', 'lastname', 'type', 'model', 'brand', 'year', 'length', 'boat_position']} header={header}
                    emptyMessage="No boats found.">
                <Column field="person_name" header="Customer Name" body={customerBodyTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="type" header="Type Boat" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="model" header="Model Boat" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column field="brand" header="Brand Boat" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header="Year" filterField='year' dataType='date' style={{ minWidth: '10rem' }} body={dateBodyTemplate} filterElement={dateFilterTemplate} />
                <Column header="Length" filterField="length" dataType="numeric" style={{ minWidth: '10rem' }} body={lengthBodyTemplate} filter filterElement={lengthFilterTemplate} />
                <Column field="boat_position" header="Boat Position" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default BoatsIndex