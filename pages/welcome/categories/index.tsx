import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Categories } from '@/hooks/categories';
import { Category } from '@/interfaces/serviceCategories.interface';
import LayoutAdmin from '@/components/layoutAdmin';

const CategoriesIndex: React.FC = () => {
    const { getAllCategories } = Categories();
    
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [filters, setFilters] = useState<any | null>(null);

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllCategories(setCategories, setLoading);
        initFilters();
    }, []);

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
            category_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        });
        setGlobalFilterValue('');
    };

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

    const header = renderHeader();


  return (
    <LayoutAdmin index={2} sideItem={2}>
        <div className='w-full '>
            <DataTable value={categories!} paginator showGridlines rows={10} loading={loading} dataKey="id_category" 
                    filters={filters!} globalFilterFields={['category_name']} header={header}
                    emptyMessage="No categories found.">
                <Column field="category_name" header="Category Name" filter filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} />
            </DataTable>
        </div>
    </LayoutAdmin>
  )
}

export default CategoriesIndex