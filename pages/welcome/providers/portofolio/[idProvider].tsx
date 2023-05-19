import LayoutAdmin from '@/components/layoutAdmin'
import React, {useState, useEffect, useRef} from 'react'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Portofolio } from '@/interfaces/portofolio.interface';
import { Portofolios } from '@/hooks/portofolio';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Providers } from '@/hooks/providers';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Create from './create';
import Edit from './edit';
import Link from 'next/link';
import { BackAnimated } from '@/components/buttons/animated';
import { Tooltip } from 'primereact/tooltip';
import { Slider } from 'primereact/slider';

const PortofolioIndex: React.FC = () => {
    const {getPortofolioProvider, deleteImagePortofolio} = Portofolios();
    const {show} = Providers()

    const router = useRouter();
    
    const [portofolio, setPortofolio] = useState<Portofolio[]>([]);
    const [portofolioList, setPortofolioList] = useState<any>(null);
    const [provider, setProvider] = useState<any>('');

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    
    useEffect(() => {
        if(router.query.idProvider) {
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
    }

    const itemTemplate = (portofolio: Portofolio) => {
        return (
            <div className="w-full">
                <div className="w-full flex justify-between p-4 gap-4">
                    <img className="w-[85px] shadow-md block mx-auto rounded-md" src={`${portofolio.portofolio_image}`} alt='photo' />
                    <div className="flex justify-between items-center flex-1 gap-4">
                        <div className="w-full">
                            <div className="text-base">{portofolio.portofolio_description}</div>
                        </div>
                        <div className="flex flex-row items-center justify-end gap-1">
                            <Edit idPortofolio={Number(portofolio.id_portofolio)} portofolio={portofolioList} setPortofolio={setPortofolioList} toast={toast} setLoading={setLoading} />
                            <Button 
                            icon="pi pi-trash" 
                            className="p-button-rounded p-button-danger" 
                            text tooltip='Delete' 
                            tooltipOptions={{ position: 'top' }}
                            onClick={() => confirmDelete(portofolio.id_portofolio)}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const header = () => {
        return (
            <div className='flex justify-between items-center'>
                <p className='text-lg uppercase'>Portofolio: {provider.provider_name} </p>
                <Create idProvider={provider.id_provider} portofolio={portofolio} setPortofolio={setPortofolio} setLoading={setLoading} toast={toast} />
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
    
    const paginator = {
        layout: 'RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
        RowsPerPageDropdown: () => {
            return (
                <div className="flex">
                    <Link href={'/welcome/providers'} >
                        <BackAnimated></BackAnimated>
                    </Link>
                </div>
            );
        },
        CurrentPageReport: (options: any) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            );
        }
    };

  return (
    <LayoutAdmin index={2} sideItem={0}>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full'>
            <DataView value={portofolio} itemTemplate={itemTemplate} paginator paginatorTemplate={paginator} rows={4} header={header()} emptyMessage={'No images found'} />
        </div>
    </LayoutAdmin>
  )
}

export default PortofolioIndex