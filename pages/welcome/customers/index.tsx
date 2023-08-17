import LayoutAdmin from '@/components/layoutAdmin';
import { Auth } from '@/hooks/auth';
import { Customer, Profile } from '@/interfaces/interfaces';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState, useRef } from 'react';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Customers } from '@/hooks/customers';

const Index = () => {
    const { getAllCustomers } = Customers();
    const { getUserAuthenticated } = Auth();

    const [customers, setCustomers] = useState<Customer[]>([]);
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

    const items = (idProvider: number) => {
        return (
            [
                {
                    label: 'Services',
                    url: `/welcome/providers/services/${idProvider}`,
                    icon: 'pi pi-th-large'
                },
                {
                    label: 'Ratings',
                    url: `/welcome/providers/ratings/${idProvider}`,
                    icon: 'pi pi-comments'
                },
                {
                    label: 'Portofolio',
                    url: `/welcome/providers/portofolio/${idProvider}`,
                    icon: 'pi pi-cloud-upload'
                }
            ]
        )
    }

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        person_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });

    const getUserAuth = async () => {
        try {
            const response = await getUserAuthenticated();
            if(response.status == 200) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCustomers = async () => {
        const response = await getAllCustomers();
        setCustomers(response.data.customers);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        getUserAuth();
        getCustomers();
    }, []);

    const formatStatus = (state: boolean) => {
        if(state) {
            return 'Active'
        } else {
            return 'Inactive'
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
    
    const emptyMessageTemplate = () => {
        return (
            <div className='w-full flex justify-center'>
                <p>No customers found.</p>
            </div>
        );
    };
    
    const statusBodyTemplate = (rowData: Customer) => {
        return (
            <div className={`px-3 py-0.5 rounded-md justify-center items-center gap-2.5 inline-flex ${rowData.profile_state ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`text-xs font-semibold ${rowData.profile_state ? 'text-green-800' : 'text-red-800'}`}>{formatStatus(rowData.profile_state)}</p>
            </div>
        );
    };

    const phoneBodyTemplate = (rowData: Customer) => {
        return <p className={`w-full line-clamp-3 ${rowData.phone == null || rowData.phone == '' ? 'text-gray-900/50' : 'text-gray-900'}`}>{rowData.phone || 'No phone'}</p>;
    };

    const customerBodyTemplate = (rowData: Customer) => {
        return (
            <p>{rowData.lastname}, {rowData.person_name}</p>
        );
    };

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <div className='w-full p-5'>
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Customers</h1>
            <div className='mt-5'>
                <DataTable value={customers} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={['person_name', 'email', 'phone']} dataKey="id_customer"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage={emptyMessageTemplate} tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column field="person_name" header="Customer Name" body={customerBodyTemplate} sortable style={{ width: '25%' }}></Column>
                    <Column field="email" header="Email" sortable style={{ width: '25%' }}></Column>
                    <Column header='phone' body={phoneBodyTemplate} style={{ width: '25%' }} />
                    <Column field="profile_state" header="Status" body={statusBodyTemplate} sortable style={{ width: '25%' }}></Column>
                </DataTable>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Index
