import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import LayoutAdmin from '@/components/layoutAdmin';
import { ServiceHistory } from '@/interfaces/interfaces';
import { formatDate } from '@/functions/date';
import { Contracts } from '@/hooks/contracts';
import { Toast } from 'primereact/toast';

const ServiceHistoryIndex: React.FC = () => {
    const { getContracts, updateContract } = Contracts();

    const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>([]);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);
    const dt = useRef<any>(null);

    const [states] = useState<string[]>(['APPROVED', 'PENDING', 'CANCELED']);

    const getSeverity = (status: string) => {
        switch (status) {
            case 'CANCELED':
                return 'danger';

            case 'APPROVED':
                return 'success';

            case 'PENDING':
                return 'warning';
        }
    };

    useEffect(() => {
        setLoading(true);
        getContracts(setServiceHistory, getServicesHistories, setLoading);
        initFilters();
    }, []);

    const getServicesHistories = (data: any) => {
        return [...(data || [])].map((d) => {
            d.contract_date = new Date(d.contract_date);

            return d;
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
            service_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            provider_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            person_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            lastname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            contract_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            contract_state: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            contract_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

        });
        setGlobalFilterValue('');
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(serviceHistory);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'service_history');
        });
    };

    const saveAsExcelFile = (buffer: any, fileName: any) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <Button type="button" icon="pi pi-filter-slash" className='p-button-success' label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
                <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} tooltip="Export Excel" tooltipOptions={{position: 'top'}} />
            </div>
        );
    };

    const priceBodyTemplate = (rowData: ServiceHistory) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    };

    const priceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputNumber value={options.value} onChange={(e: any) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const stateBodyTemplate = (rowData: ServiceHistory) => {
        return <Tag value={rowData.contract_state} severity={getSeverity(rowData.contract_state)} />;
    };

    const stateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={states} onChange={(e: any) => options.filterCallback(e.value, options.index)} itemTemplate={stateItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const stateItemTemplate = (option: string) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const dateBodyTemplate = (rowData: ServiceHistory) => {
        return formatDate(String(rowData.contract_date));
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e: any) => options.filterCallback(e.value, options.index)} dateFormat="M dd, yy" placeholder="May 25, 2023" />;
    };

    const customerBodyTemplate = (rowData: ServiceHistory) => {
        return (
            <div className="flex items-center gap-2">
                <span>{rowData.person_name} {rowData.lastname}</span>
            </div>
        );
    };
    
    const header = renderHeader();

    const onRowEditComplete = (e: any) => {
        setLoading(true);
        let { newData } = e;
        updateContract(Number(newData.id_contract), newData, serviceHistory, setServiceHistory, toast, setLoading);
    };

    const textEditor = (options: any) => {
        return <InputText type="text" value={options.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback(e.target.value)} />;
    };

    const statusEditor = (options: any) => {
        return (
            <Dropdown
                value={options.value}
                options={states}
                onChange={(e: any) => options.editorCallback(e.value)}
                placeholder="Select a Status"
                itemTemplate={(option) => {
                    return <Tag value={option} severity={getSeverity(option)}></Tag>;
                }}
            />
        );
    };

    const priceEditor = (options: any) => {
        return <InputNumber value={options.value} onValueChange={(e: any) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
    };

  return (
    <LayoutAdmin>
        <Toast ref={toast} />
        <div className='w-full h-full'>
            <DataTable ref={dt} value={serviceHistory!} paginator  rows={10} loading={loading} dataKey="id_contract"
                    filters={filters} globalFilterFields={['service_name', 'provider_name', 'person_name', 'lastname', 'price', 'contract_date', 'contract_state', 'contract_description']} header={header}
                    emptyMessage="No Service History found." editMode="row" onRowEditComplete={onRowEditComplete}
                    className='min-h-full'>
                <Column header="Service Name" field="service_name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header="Provider Name" field="provider_name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header="Customer Name" field="person_name" body={customerBodyTemplate} filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header="Price" field="price" filter filterField="price" dataType="numeric" style={{ minWidth: '10rem' }} body={priceBodyTemplate} filterElement={priceFilterTemplate} editor={(options) => priceEditor(options)} />
                <Column header="Date" filterField="contract_date" filter dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate} filterElement={dateFilterTemplate} />
                <Column header="Contract State" field="contract_state" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={stateBodyTemplate} filterElement={stateFilterTemplate} editor={(options) => statusEditor(options)} />
                <Column header="Detail Service" field="contract_description" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} editor={(options) => textEditor(options)} />
                <Column header="Edit" rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default ServiceHistoryIndex