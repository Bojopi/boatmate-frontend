import LayoutAdmin from '@/components/layoutAdmin'
import { Auth } from '@/hooks/auth'
import { Contracts } from '@/hooks/contracts'
import { ContractProvider, Profile } from '@/interfaces/interfaces'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable, DataTableFilterMeta } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState, useRef } from 'react'
import { formatDateHour } from '@/functions/date'
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import View from './view'

const Index = () => {
    const { getContractsProvider } = Contracts();
    const { getUserAuthenticated } = Auth();

    const[contracts, setContracts] = useState<ContractProvider[]>([]);
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

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null)

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        service_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        person_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        contract_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        contract_price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }], },
        contract_date_finished: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS}]},
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
                const contracts = response.data.contracts.filter((item: ContractProvider) => item.contract_state == 'FINISHED' || item.contract_state == 'CANCELED');
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

    const setStatusStyle = (value: string) => {
        switch (value) {
            case 'FINISHED':
                return 'text-green-600/60 font-semibold'
            case 'CANCELED':
                return 'text-red-500 font-semibold line-through'
        }
    }

    const formatStatus = (value: string) => {
        switch (value) {
            case 'FINISHED':
                return 'Completed'
            case 'CANCELED':
                return 'Canceled'
        }
    }

    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div className='w-full flex justify-end'>
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
            </div>
        );
    };

    const priceBodyTemplate = (rowData: ContractProvider) => {
        return <p className={setStatusStyle(rowData.contract_state)}>{formatCurrency(rowData.contract_price || 0)}</p>;
    };
    
    const statusBodyTemplate = (rowData: ContractProvider) => {
        return <p className={`text-sm font-medium ${rowData.contract_state == 'FINISHED' ? 'text-green-600' : 'text-red-500'}`}>{formatStatus(rowData.contract_state)}</p>;
    };
    
    const descriptionBodyTemplate = (rowData: ContractProvider) => {
        return <p className='w-full line-clamp-3'>{rowData.contract_description}</p>;
    };

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <div className='w-full p-5'>
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Finished Projects</h1>
            <div className="text-gray-900/50 text-sm font-normal leading-none mt-3">Explore Customer Ratings and Reviews.</div>
            <div className='mt-5'>
                <DataTable value={contracts} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={['service_name', 'person_name', 'phone', 'contract_description', 'contract_price', 'contract_date_finished']} dataKey="id_contract"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage="No contracts found." tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column field="service_name" header="Service" sortable style={{ width: '10%' }}></Column>
                    <Column field="person_name" header="Customer" body={customerBodyTemplate} sortable style={{ width: '10%' }}></Column>
                    <Column field="phone" header="Phone" sortable style={{ width: '5%' }}></Column>
                    <Column field="contract_description" header="Description" body={descriptionBodyTemplate} sortable style={{ width: '30%' }}></Column>
                    <Column field="contract_price" header="Price" sortable dataType='numeric' body={priceBodyTemplate} style={{ width: '5%' }}></Column>
                    <Column field="contract_date_finished" header="Outcome Date" body={dateBodyTemplate} sortable style={{ width: '25%' }}></Column>
                    <Column field="contract_state" header="Status" body={statusBodyTemplate} sortable style={{ width: '10%' }}></Column>
                    <Column field="actions" body={actionsBodyTemplate} style={{ width: '5%' }}></Column>
                </DataTable>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Index
