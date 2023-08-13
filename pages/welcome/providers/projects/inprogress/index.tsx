import LayoutAdmin from '@/components/layoutAdmin'
import { Auth } from '@/hooks/auth'
import { Contracts } from '@/hooks/contracts'
import { ContractProvider, Profile } from '@/interfaces/interfaces'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column'
import { DataTable, DataTableFilterMeta } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState, useRef } from 'react'
import { formatDateHour } from '@/functions/date'
import Link from 'next/link'
import { Calendar, CalendarChangeEvent } from 'primereact/calendar'
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber'
import { Tooltip } from 'primereact/tooltip'
import View from './view'
import { RiSendPlaneLine } from 'react-icons/ri'

const Index = () => {
    const { getContractsProvider } = Contracts();
    const { getUserAuthenticated } = Auth();

    const[contracts, setContracts] = useState<ContractProvider[]>([]);
    const [selectedContract, setSelectedContract] = useState<ContractProvider[] | any>(null);
    const [user, setUser] = useState<Profile>(
        {
            uid:                 0,
            email:               '',
            state:               false,
            google:               false,
            idPerson:            0,
            name:                '',
            lastname:            '',
            phone:               '',
            image:               '',
            idRole:              0,
            role:                '',
            idProvider:          0,
            providerName:        '',
            providerImage:       '',
            providerDescription: '',
            providerLat:         '',
            providerLng:         '',
            idCustomer:          '',
            customerLat:         '',
            customerLng:         '',
            iat:                 0,
            exp:                 0,
        }
    );

    let items = [
        {label: 'Send a message', icon: 'pi pi-fw pi-send'}
    ];

    const menu = useRef<any>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null)

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        service_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        person_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        contract_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        contract_price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }], },
        contract_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS}]},
    });

    const getUserAuth = async () => {
        try {
            const response = await getUserAuthenticated();
            if(response.status == 200) {
                setUser(response.data.user)
                getContracts(response.data.user.idProvider);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getContracts = async (idProvider: number) => {
        try {
            const response = await getContractsProvider(idProvider);
            if(response.status == 200) {
                const contracts = response.data.contracts.filter((item: ContractProvider) => item.contract_state == 'APPROVED');
                setContracts(contracts);
                console.log(contracts)
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setLoading(true);
        getUserAuth();
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div className='w-full flex justify-center'>
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Search user" className='text-sm rounded-2xl px-6 py-3 opacity-60 shadow-lg text-gray-900/50' />
            </div>
        );
    };

    const customerBodyTemplate = (rowData: ContractProvider) => {
        return (
            <p>{rowData.person_name} {rowData.lastname}</p>
        );
    };
    
    const dateBodyTemplate = (rowData: ContractProvider) => {
        return (
            <p>{formatDateHour(String(rowData.contract_date))}</p>
        );
    };
    
    const actionsBodyTemplate = (rowData: ContractProvider) => {
        return (
            <div className='flex items-center justify-between'>
                <View contract={rowData} contracts={contracts} setContracts={setContracts} toast={toast} />
                <Tooltip target=".send-btn" className='text-xs' />
                <Link href={'#'} data-pr-tooltip='Send message' data-pr-position='top' className='w-8 h-8 rounded-md border border-gray-900/50 flex items-center justify-center send-btn'>
                    <RiSendPlaneLine className='w-4 h-4'/>
                </Link>
            </div>
        );
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e: CalendarChangeEvent) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const priceBodyTemplate = (rowData: ContractProvider) => {
        return <p className='text-green-600/60 font-semibold'>{formatCurrency(rowData.contract_price || 0)}</p>;
    };

    const priceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputNumber value={options.value} onChange={(e: InputNumberChangeEvent) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const descriptionBodyTemplate = (rowData: ContractProvider) => {
        return <p className='w-full line-clamp-3'>{rowData.contract_description}</p>;
    };

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <div className='w-full p-5'>
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Projects In Progress</h1>
            <div className="text-gray-900/50 text-sm font-normal leading-none mt-3">Track Your Ongoing Projects</div>
            <div className='mt-5'>
                <DataTable value={contracts} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)} selection={selectedContract} 
                        globalFilterFields={['service_name', 'person_name', 'phone', 'contract_description', 'contract_price', 'contract_date']} onSelectionChange={(e) => setSelectedContract(e.value)} selectionMode="checkbox" dataKey="id_contract"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage="No contracts found." tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column selectionMode="multiple" headerStyle={{ width: '1%' }}></Column>
                    <Column field="service_name" header="Service" sortable style={{ width: '15%' }}></Column>
                    <Column field="person_name" header="Customer" body={customerBodyTemplate} sortable style={{ width: '15%' }}></Column>
                    <Column field="phone" header="Phone" sortable style={{ width: '4%' }}></Column>
                    <Column field="contract_description" header="Description" body={descriptionBodyTemplate} sortable style={{ width: '25%' }}></Column>
                    <Column field="contract_price" header="Price" sortable dataType='numeric' body={priceBodyTemplate} style={{ width: '7%' }}></Column>
                    <Column field="contract_date" header="Submission Date" body={dateBodyTemplate} sortable style={{ width: '23%' }}></Column>
                    <Column field="actions" body={actionsBodyTemplate} style={{ width: '10%' }}></Column>
                </DataTable>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Index
