import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Categories } from '@/hooks/categories';
import LayoutAdmin from '@/components/layoutAdmin';
import { Category } from '@/interfaces/interfaces';
import Create from './create';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ButtonDelete } from '@/components/buttons/icons';

const CategoriesIndex: React.FC = () => {
    const { getAllCategories, deleteCategory } = Categories();
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        getCategories();
        initFilters();
    }, []);

    const getCategories = async () => {
        const response = await getAllCategories();
        if (response.status === 200) {
            setCategories(response.data.categories);
        }
        setLoading(false);
    }

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
            category_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <Create idCategory={0} categories={categories} setCategories={setCategories} toast={toast} loading={loading} setLoading={setLoading} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const actionsBodyTemplate = (rowData: Category) => {
        return (
            <div className="flex items-center gap-2">
                <Create idCategory={Number(rowData.id_category)} categories={categories} setCategories={setCategories} toast={toast} loading={loading} setLoading={setLoading}  />
                <ButtonDelete
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
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full '>
            <DataTable value={categories!} paginator rows={10} loading={loading} dataKey="id_category" 
                    filters={filters!} globalFilterFields={['category_name']} header={header}
                    emptyMessage="No categories found.">
                <Column field="category_name" header="Category Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
                <Column header='Actions' body={actionsBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default CategoriesIndex