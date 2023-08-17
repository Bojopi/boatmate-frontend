import LayoutAdmin from '@/components/layoutAdmin';
import { Auth } from '@/hooks/auth';
import { Profile, Provider } from '@/interfaces/interfaces';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState, useRef } from 'react';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Providers } from '@/hooks/providers';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
// import View from './view'

const Index = () => {
    const { getAllProviders } = Providers();
    const { getUserAuthenticated } = Auth();

    const [providers, setProviders] = useState<Provider[] | any[]>([]);
    const [user, setUser] = useState<Profile>(
        {
            uid: 0,
            email: '',
            state: false,
            google: false,
            idPerson: 0,
            name: '',
            lastname: '',
            phone: '',
            image: '',
            idRole: 0,
            role: '',
            idProvider: 0,
            providerName: '',
            providerImage: '',
            providerDescription: '',
            providerLat: '',
            providerLng: '',
            idCustomer: '',
            customerLat: '',
            customerLng: '',
            iat: 0,
            exp: 0,
        }
    );

    const [itemsMenu, setItemsMenu] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null)
    const menuComponent = useRef<Menu>(null);

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        provider_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        person_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        provider_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        phone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        profile_state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });

    const getUserAuth = async () => {
        try {
            const response = await getUserAuthenticated();
            if (response.status == 200) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getProviders = async () => {
        try {
            const response = await getAllProviders();
            if (response.status == 200) {
                const addMenu = response.data.providers.map((item: any) => {
                    item['items'] = [
                        {
                            label: 'Edit provider',
                            url: `/welcome/providers/edit/${item.id_provider}`,
                            icon: 'pi pi-pencil'
                        },
                        {
                            label: 'Services',
                            url: `/welcome/providers/services/${item.id_provider}`,
                            icon: 'pi pi-th-large'
                        },
                        {
                            label: 'Ratings',
                            url: `/welcome/providers/ratings/${item.id_provider}`,
                            icon: 'pi pi-comments'
                        },
                        {
                            label: 'Portofolio',
                            url: `/welcome/providers/portofolio/${item.id_provider}`,
                            icon: 'pi pi-cloud-upload'
                        }
                    ];

                    return item;
                })

                setProviders(addMenu);
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setLoading(true);
        getUserAuth();
        getProviders();
    }, []);

    const formatStatus = (state: boolean) => {
        if (state) {
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
                <InputText 
                type="search" 
                value={value || ''} 
                onChange={(e) => onGlobalFilterChange(e)} 
                placeholder="Search user" 
                className='text-sm rounded-2xl px-6 py-3 opacity-60 shadow-lg text-gray-900/50' />
            </div>
        );
    };

    const emptyMessageTemplate = () => {
        return (
            <div className='w-full flex justify-center'>
                <p>No services found.</p>
            </div>
        );
    };

    const customerBodyTemplate = (rowData: Provider) => {
        return (
            <p>{rowData.lastname}, {rowData.person_name}</p>
        );
    };

    const statusBodyTemplate = (rowData: Provider) => {
        return (
            <div className={`px-3 py-0.5 rounded-md justify-center items-center gap-2.5 inline-flex ${rowData.profile_state ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`text-xs font-semibold ${rowData.profile_state ? 'text-green-800' : 'text-red-800'}`}>{formatStatus(rowData.profile_state)}</p>
            </div>
        );
    };

    const showMenu = (items: any, idProvider: number, event: any) => {
        setItemsMenu(items)
        menuComponent.current!.toggle(event)
    }

    const actionsBodyTemplate = (rowData: Provider | any) => {
        console.log(rowData)
        return (
            <div className='flex items-center justify-between'>
                <Button icon="pi pi-ellipsis-v" rounded text severity='secondary' className="mr-2" onClick={(event) => {showMenu(rowData.items, rowData.id_provider, event); }} aria-controls={`popup_menu`} aria-haspopup />
            </div>
        );
    };

    const descriptionBodyTemplate = (rowData: Provider) => {
        return <p className={`w-full line-clamp-3 ${rowData.provider_description == null || rowData.provider_description == '' ? 'text-gray-900/50' : 'text-gray-900'}`}>{rowData.provider_description || 'No description'}</p>;
    };

    const providerNameBodyTemplate = (rowData: Provider) => {
        return (
            <div className='flex items-center gap-2'>
                {
                    rowData.provider_image != null ?
                        <img src={`${rowData.provider_image}`} alt={`${rowData.provider_name}`} className='w-10 h-10 rounded-full' />
                        :
                        <Avatar icon="pi pi-image" size='large' shape="circle" />
                }
                <p className={`w-full ${rowData.provider_name == null || rowData.provider_name == '' ? 'text-gray-900/50' : 'text-gray-900'}`}>{rowData.provider_name || 'No name'}</p>
            </div>
        );
    };

    const phoneBodyTemplate = (rowData: Provider) => {
        return <p className={`w-full ${rowData.phone == null || rowData.phone == '' ? 'text-gray-900/50' : 'text-gray-900'}`}>{rowData.phone || 'No phone number'}</p>;
    };

    return (
        <LayoutAdmin>
            <Spinner loading={loading} />
            <Toast ref={toast} />
            <Menu model={itemsMenu} popup ref={menuComponent} id={`popup_menu`} />
            <div className='w-full p-5'>
                <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Providers</h1>
                <div className='mt-5'>
                    <DataTable value={providers} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={['provider_name', 'person_name', 'provider_description', 'email', 'phone', 'profile_state']} dataKey="id_provider"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage={emptyMessageTemplate} tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                        <Column field="provider_name" header="Provider Name" body={providerNameBodyTemplate} sortable style={{ width: '20%' }}></Column>
                        <Column field="person_name" header="Owner's Name" body={customerBodyTemplate} sortable style={{ width: '20%' }}></Column>
                        <Column field="provider_description" header="Description" body={descriptionBodyTemplate} sortable style={{ width: '25%' }}></Column>
                        <Column field="email" header="Email" sortable style={{ width: '15%' }}></Column>
                        <Column field="phone" header="Phone Number" body={phoneBodyTemplate} sortable style={{ width: '5%' }}></Column>
                        <Column field="profile_state" header="Status" body={statusBodyTemplate} sortable style={{ width: '10%' }}></Column>
                        <Column field="actions" body={actionsBodyTemplate} style={{ width: '5%' }}></Column>
                    </DataTable>
                </div>
            </div>
        </LayoutAdmin>
    )
}

export default Index
