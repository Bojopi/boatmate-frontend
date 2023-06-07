import React, {useState, useEffect, useRef} from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { Contracts } from '@/hooks/contracts'
import { ContractCustomer } from '@/interfaces/interfaces';
import { useRouter } from 'next/router';
import ProviderServiceCardComponent from '@/components/providerServiceCard';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';

const ApplicationsPage = () => {
    const { getContractsCustomer } = Contracts();

    const [contracts, setContracts] = useState<ContractCustomer[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const router = useRouter();

    const getContracts = async (idCustomer: number) => {
        try {
            const response = await getContractsCustomer(idCustomer);
            if(response.status == 200) {
              setContracts(response.data.contracts);
              setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
      setLoading(true);
        if(router.query.idCustomer) {
          getContracts(Number(router.query.idCustomer))
        }
    }, [router.query.idCustomer])

  return (
    <LayoutPrincipal>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <div className='w-full md:w-[70%] h-full p-10 m-auto flex flex-col gap-3'>
          {
            contracts.map((contract: ContractCustomer, i: number) => {
              return (
                <ProviderServiceCardComponent key={i} contract={contract} setLoading={setLoading} toast={toast} contractList={contracts} setContractList={setContracts} />
              )
            })
          }
        </div>
    </LayoutPrincipal>
  )
}

export default ApplicationsPage