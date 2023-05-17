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

const PortofolioIndex: React.FC = () => {
    const {getPortofolioProvider, deleteImagePortofolio} = Portofolios();
    const {show} = Providers()

    const router = useRouter();
    
    const [portofolio, setPortofolio] = useState<Portofolio[]>([]);
    const [provider, setProvider] = useState<any>('');

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    
    useEffect(() => {
        if(router.query.id) {
            getProvider(Number(router.query.id));
            getPortofolioProvider(Number(router.query.id), setPortofolio);
        }
    }, [router.query.id]);

    const getProvider = async (idProvider: number) => {
        const response = await show(idProvider)
        setProvider(response.data.provider)
    }

    const itemTemplate = (portofolio: Portofolio) => {
        return (
            <div className="w-full">
                <div className="w-full flex justify-between p-4 gap-4">
                    <img className="w-[85px] shadow-md block mx-auto rounded-md" src={`${portofolio.portofolio_image}`} alt='photo' />
                    <div className="flex justify-between items-center flex-1 gap-4">
                        <div className="w-full">
                            <div className="text-base font-medium">{portofolio.portofolio_description}</div>
                        </div>
                        <div className="flex flex-row justify-end gap-1">
                            <Button 
                            icon="pi pi-pencil" 
                            className="p-button-rounded" 
                            text tooltip='Edit' 
                            tooltipOptions={{ position: 'top' }}></Button>
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
                getPortofolioProvider(provider.id_provider, setPortofolio);
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

  return (
    <LayoutAdmin index={2} sideItem={0}>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='w-full'>
            <DataView value={portofolio} itemTemplate={itemTemplate} paginator rows={4} header={header()} />
        </div>
    </LayoutAdmin>
  )
}

export default PortofolioIndex