import LayoutAdmin from '@/components/layoutAdmin'
import React, {useState, useEffect, useRef} from 'react'
import { DataView } from 'primereact/dataview';
import { Portofolios } from '@/hooks/portofolio';
import { useRouter } from 'next/router';
import { Providers } from '@/hooks/providers';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Create from './create';
import Edit from './edit';
import Link from 'next/link';
import { BackAnimated } from '@/components/buttons/animated';
import { ButtonDelete } from '@/components/buttons/icons';
import { Portofolio } from '@/interfaces/interfaces';
import { BreadCrumb } from 'primereact/breadcrumb';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { generateBreadcrumbItems } from '@/functions/breadcrumb';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Spinner from '@/components/spinner';

const PortofolioIndex: React.FC = () => {
    const {getPortofolioProvider, deleteImagePortofolio} = Portofolios();
    const {show} = Providers()

    const router = useRouter();

    const [portofolio, setPortofolio] = useState<Portofolio[]>([]);
    const [portofolioList, setPortofolioList] = useState<any>(null);
    const [provider, setProvider] = useState<any>('');

    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        portofolio_description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });

    const home = {icon: 'pi pi-home'}

    const breadcrumbItems = [
        ...generateBreadcrumbItems(router.asPath)
    ];

    useEffect(() => {
        if(router.query.idProvider) {
            setLoading(true);
            getProvider(Number(router.query.idProvider));
            getPortofolio(Number(router.query.idProvider), setPortofolio);
        }
    }, [router.query.idProvider]);

    useEffect(() => {
        setPortofolio(portofolioList)
    }, [portofolioList])

    const getProvider = async (idProvider: number) => {
        const response = await show(idProvider)
        setProvider(response.data.provider)
    }

    const getPortofolio = async (idProvider: number, setPortofolio: any) => {
        const response = await getPortofolioProvider(idProvider);
        setPortofolio(response.data.portofolio);
        setPortofolioList(response.data.portofolio);
        setLoading(false);
    }

    const imageTemplate = (rowData: Portofolio) => {
        return (
            <div className="w-full">
                <div className='w-40 h-40 flex items-center justify-center'>
                    <img src={rowData.portofolio_image} alt="image" className='w-full h-full object-cover' />
                </div>
            </div>
        );
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div className='w-full flex justify-between'>
                <Create 
                idProvider={provider.id_provider} 
                portofolio={portofolio} 
                setPortofolio={setPortofolio} 
                loading={loading}
                setLoading={setLoading} 
                toast={toast} />
                <InputText 
                type="search" 
                value={value || ''} 
                onChange={(e) => onGlobalFilterChange(e)} placeholder="Search by description" className='text-sm rounded-2xl px-6 py-3 opacity-60 shadow-lg text-gray-900/50' />
            </div>
        );
    };

    const header = () => {
        return (
            <div className='flex justify-between items-center'>
                <p className='text-lg uppercase'>Portofolio: {provider.provider_name} </p>
                <Create 
                idProvider={provider.id_provider} 
                portofolio={portofolio} 
                setPortofolio={setPortofolio} 
                setLoading={setLoading} 
                loading={loading}
                toast={toast} />
            </div>
        )
    };

    const confirmDelete = (idPortofolio: number) => {
        const accept = async () => {
            setLoading(true)
            const response = await deleteImagePortofolio(idPortofolio)
            if(response.status == 200) {
                setLoading(false)
                getPortofolio(provider.id_provider, setPortofolio);
                toast.current!.show({severity:'success', summary:'Success', detail: `${response.data.msg}`, life: 4000});
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

    const emptyMessageTemplate = () => {
        return (
            <div className='w-full flex justify-center'>
                <p>No photos found.</p>
            </div>
        );
    };

    const descriptionBodyTemplate = (rowData: Portofolio) => {
        return <p className={`w-full line-clamp-3 ${rowData.portofolio_description == null || rowData.portofolio_description == '' ? 'text-gray-900/50' : 'text-gray-900'}`}>{rowData.portofolio_description || 'No description'}</p>;
    };

    const actionsBodyTemplate = (rowData: Portofolio) => {
        return (
          <div className="flex items-center justify-center gap-3">
            <Edit 
            idPortofolio={Number(rowData.id_portofolio)}
            portofolio={portofolioList} 
            setPortofolio={setPortofolioList}
            toast={toast}
            loading={loading}
            setLoading={setLoading} />
            <Button
            type="button" 
            icon='pi pi-trash' 
            outlined 
            tooltip='Delete' 
            tooltipOptions={{position: 'top' }}
            className='w-8 h-8 rounded-md text-gray-900/50 border border-gray-900/50 flex items-center justify-center view-btn'
            onClick={() => confirmDelete(Number(rowData.id_portofolio))} />
          </div>
        );
    };

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full p-5'>
            <BreadCrumb model={breadcrumbItems} home={home} className='border-none' />
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Portofolio of {provider.provider_name}</h1>
            <div className='mt-5'>
                <DataTable value={portofolio} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={['portofolio_description']} dataKey="id_portofolio"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage={emptyMessageTemplate} tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column field="portofolio_image" header="Image" body={imageTemplate} style={{ width: '30%' }}></Column>
                    <Column field="portofolio_description" header="Description" body={descriptionBodyTemplate} sortable style={{ width: '60%' }}></Column>
                    <Column field="actions" body={actionsBodyTemplate} style={{ width: '10%' }}></Column>
                </DataTable>
            </div>
        </div>
        {/* <div className='w-full h-full'>
            <DataView
            value={portofolio}
            loading={loading}
            itemTemplate={itemTemplate}
            paginator
            paginatorTemplate={paginator}
            rows={4}
            layout={'list'}
            header={header()}
            emptyMessage={'No images found'}
            className='min-h-full' />
        </div> */}
    </LayoutAdmin>
  )
}

export default PortofolioIndex