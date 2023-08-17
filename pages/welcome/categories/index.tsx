import LayoutAdmin from '@/components/layoutAdmin';
import { Auth } from '@/hooks/auth';
import { Category, Profile } from '@/interfaces/interfaces';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState, useRef } from 'react';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Categories } from '@/hooks/categories';
import Create from './create';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// import View from './view'

const Index = () => {
    const { getAllCategories, deleteCategory } = Categories();
    const { getUserAuthenticated } = Auth();

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category[] | any>(null);
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
    const menuComponent = useRef<Menu>(null);

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        category_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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

    const getCategories = async () => {
        const response = await getAllCategories();
        if (response.status === 200) {
            setCategories(response.data.categories);
        }
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        getUserAuth();
        getCategories();
    }, []);


    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div className='w-full flex justify-between'>
                <Create idCategory={0} categories={categories} setCategories={setCategories} toast={toast} loading={loading} setLoading={setLoading} />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Search category" className='text-sm rounded-2xl px-6 py-3 opacity-60 shadow-lg text-gray-900/50' />
            </div>
        );
    };
    
    const emptyMessageTemplate = () => {
        return (
            <div className='w-full flex justify-center'>
                <p>No categories found.</p>
            </div>
        );
    };
    
    const actionsBodyTemplate = (rowData: Category) => {
        return (
            <div className='flex items-center justify-between'>
                <Create idCategory={Number(rowData.id_category)} categories={categories} setCategories={setCategories} toast={toast} loading={loading} setLoading={setLoading}  />
                <Button 
                type="button" 
                icon='pi pi-trash' 
                outlined 
                tooltip='Delete' 
                tooltipOptions={{position: 'top' }}
                className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn'
                onClick={() => confirmDelete(Number(rowData.id_category))}
                />
            </div>
        );
    };

    const confirmDelete = (idCategory: number) => {
        const accept = async () => {
            setLoading(true)
            const response = await deleteCategory(idCategory);
            if (response.status === 200) {
                toast.current!.show({severity:'success', summary:'Success', detail: `${response.data.msg}`, life: 4000});
                getCategories();
            } else {
                toast.current!.show({severity:'error', summary:'Error', detail: `${response.data.msg}`, life: 4000});
                setLoading(false);
            }
        }
        const reject = () => {toast.current!.show({severity:'info', summary:'Info', detail: 'Operation rejected', life: 4000});}
        confirmDialog({
            message: 'Do you want to delete this category?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full p-5'>
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Categories</h1>
            <div className='mt-5'>
                <DataTable value={categories} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={['category_name']} dataKey="id_category"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage={emptyMessageTemplate} tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column field="category_name" header="Category Name" sortable style={{ width: '90%' }}></Column>
                    <Column field="actions" body={actionsBodyTemplate} style={{ width: '10%' }}></Column>
                </DataTable>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Index
