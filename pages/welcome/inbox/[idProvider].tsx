import React, {useState, useEffect, useRef} from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { useRouter } from 'next/router';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Contracts } from '@/hooks/contracts';
import { ContractProvider } from '@/interfaces/interfaces';
import { formatDateDash, formatDateMessage } from '@/functions/date';
import { PuffLoader } from 'react-spinners'

import io from 'socket.io-client'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Conversations } from '@/hooks/conversation';


const socket = io('http://localhost:8080');

export type InboxProps = {
  contractId?: number;
}

const InboxPage: React.FC<InboxProps> = ({contractId}) => {
  const { getContractsProvider } = Contracts();
  const { getMessages, sendMessage } = Conversations();

  const [contracts, setContracts] = useState<ContractProvider[]>([]);
  const [selectedContract, setSelectedContract] = useState<any>();
  const [indexActive, setIndexActive] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [loadingSend, setLoadingSend] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [storedMessage, setStoredMessage] = useState<any[]>([]);

  const toast = useRef<Toast>(null);

  const router = useRouter();

  const setColorStatus = (state: string) => {
    switch (state) {
      case 'PENDING':
        return 'text-neutral-600'
      case 'OFFERED':
        return 'text-purple-600'
      case 'APPROVED':
        return 'text-teal-600'
      case 'CANCELED':
        return 'text-rose-500'
      default:
        break;
    }
  };

  const getMessagesContract = async (idContract: number = 0) => {
    try {
      const response = await getMessages(idContract);
      if(response.status == 200) {
        setStoredMessage(response.data.messages);
        setTimeout(() => {
          const messageContainer = document.getElementById('message-container');
          if(messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight
          }
        }, 0)
        setLoadingChat(false)
      }
    } catch (error) {
      console.log(error);
      setStoredMessage([]);
      setLoadingChat(false)
    }
  }

  const getContracts = async (idCustomer: number) => {
    try {
      const response = await getContractsProvider(idCustomer);
      if(response.status == 200) {
        setContracts(response.data.contracts);

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true)
    if(router.query.idProvider) {
      getContracts(Number(router.query.idProvider));
      socket.emit('user_connected', router.query.idProvider);
    }
  }, [router.query.idProvider]);

  useEffect(() => {
    socket.on('message', recieveMessage);

    return () => {socket.off('message', recieveMessage)}
  }, [])

  const selectContract = (idContract: number) => {
    setLoadingChat(true);
    setStoredMessage([])
    if(contracts.length > 0) {
      const item = contracts.find((contract: ContractProvider) => contract.id_contract === idContract)
      setSelectedContract(item);
      getMessagesContract(item && item.id_contract);
    }
  }

  useEffect(() => {
    if(contractId && contractId !== 0) {
      selectContract(contractId)
    }
  }, [contractId]);

  const sendToBackendMessage = async (idContract: number, data: any) => {
    try {
      const response = await sendMessage(idContract, data);
      if(response.status === 200) {
        socket.emit('message', response.data.message);
        setMessage('');
        setLoadingSend(false);
      }
    } catch (error) {
      console.log(error);
      setLoadingSend(false);
    }
  }

  const sendMessages = (e: any) => {
    e.preventDefault();
    setLoadingSend(true);
    const data = {
      messageText: message,
      date: new Date().toISOString(),
      providerId: Number(router.query.idProvider)
    }
    sendToBackendMessage(selectedContract.id_contract, data);
  }

  const recieveMessage = (message: any) => {
    console.log(message)
    setStoredMessage((state) => [...state, message]);
  }

  return (
    <div className='relative overflow-hidden'>
      <LayoutPrincipal>
          <Spinner loading={loading} />
          <Toast ref={toast} />
          <p className='w-full md:w-[80%] mx-auto mt-28 font-semibold'>Inbox</p>
          <div className="w-[500px] h-[500px] left-[80%] top-[300px] absolute bg-sky-500/30 rounded-full blur-3xl -z-10" />
          <div className='w-[80%] h-full mx-auto mt-8 flex gap-5'>
            <div className='max-h-[500px] h-full w-96 border rounded-xl shrink-0 overflow-x-hidden overflow-y-auto'>
              {
                contracts.length > 0 ?
                contracts.map((item: ContractProvider, i: number) => (
                  <div id={String(i)} key={i} className={`w-full h-auto max-h-44 border flex items-start gap-3 p-3 py-4 ${indexActive == i ? 'active-inbox' : ''} cursor-pointer hover:bg-zinc-100`} onClick={() => {
                    setIndexActive(i);
                    selectContract(item.id_contract)
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path id='svg-gear' fill='#000' d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>
                    <div className='w-full'>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-5'>
                          <p className='font-semibold leading-normal'>{item.person_name} {item.lastname}</p>
                          <p className='text-teal-600 font-semibold leading-normal'>$ {item.contract_price || 0}</p>
                        </div>
                        <p className='text-zinc-500 leading-normal'>{formatDateDash(String(item.contract_date))}</p>
                      </div>
                      <div className='w-full flex flex-col gap-1 mt-1'>
                        <p className={`text-sm leading-tight ${setColorStatus(item.contract_state)}`} style={{textTransform: 'capitalize'}}>{(item.contract_state).toLowerCase()}</p>
                        <p className='text-sm text-neutral-600 font-light line-clamp-3 leading-tight '>{item.contract_description}</p>
                      </div>
                    </div>
                  </div>
                ))
                : null
              }
            </div>
            <div className='h-auto w-full flex flex-col justify-between border rounded-xl bg-white p-4'>
              {
                selectedContract && selectedContract !== null ?
                  <>
                    <div>
                      <div className='w-full flex items-end gap-5'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path id='svg-gear' fill='#000' d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>
                        <div className='w-full flex items-center justify-between'>
                          <div>
                            <p className='text-sm'><span className='text-zinc-500'>{formatDateDash(String(selectedContract.contract_date))}</span></p>
                            <p className='text-lg'>{selectedContract.person_name} {selectedContract.lastname}</p>
                          </div>
                          <p className='text-teal-600 text-2xl font-semibold'>$ {selectedContract.contract_price || 0}</p>
                        </div>
                      </div>
                      <div className='ml-11 mt-2 flex flex-col gap-3'>
                        <p className={`${setColorStatus(selectedContract.contract_state)} text-sm`} style={{textTransform: 'capitalize'}}>{(selectedContract.contract_state).toLowerCase()}</p>
                        <p className='text-sm text-neutral-600 font-light'>{selectedContract.contract_description}</p>
                      </div>
                    </div>
                    <form onSubmit={sendMessages}>
                      <div id='message-container' className='w-full h-64 p-5 border rounded-tl-xl rounded-tr-xl overflow-y-auto flex flex-col gap-3'>
                      <div className={`${loadingChat ? 'w-full h-full flex justify-center z-20 items-center' : 'hidden'}`}>
                        <PuffLoader loading={loadingChat} color="#36d7b7" />
                      </div>
                        {
                          storedMessage && storedMessage.length > 0 ?
                          storedMessage.map((store: any, i: number) => (
                            <div key={i} className={`flex flex-col ${store.customerId ? 'mr-auto items-start' : 'ml-auto items-end'}`}>
                              <p className={`w-auto text-[10px] text-gray-400 ${store.customerId ? 'text-start': 'text-end'}`}>{formatDateMessage(String(new Date(store.message_date)))}</p>
                              <div className={`py-2 px-3 rounded-xl w-auto text-sm ${store.customerId ? 'bg-gray-200' : 'bg-sky-300'}`}>{store.message_text}</div>
                            </div>
                          ))
                          : <p className={`w-auto mx-auto text-xs ${loadingChat ? 'hidden': 'block'}`}>No messages</p>
                        }
                      </div>
                      <div className='w-full flex items-center justify-between'>
                        <InputText 
                        type="text" 
                        className='w-full' 
                        value={message} 
                        disabled={loadingSend}
                        onChange={(e: any) => setMessage(e.target.value)} />
                        <Button 
                        type='submit' 
                        label='Send' 
                        disabled={loadingSend}
                        icon={`pi ${loadingSend ? 'pi-spin pi-spinner' : 'pi-send'}`} 
                        className='w-auto px-5 shrink-0'></Button>
                      </div>
                    </form>
                  </>
                :
                <div className='w-full h-full flex flex-col items-center justify-center'>
                  <img 
                  src="https://i.postimg.cc/8PvpVfjW/Messages-pana.png" 
                  className='w-[50%]'
                  alt="chat" />
                  <p className='text-xl text-gray-900/70'>Select a Contract</p>
                  <p className='text-sm text-gray-900/50'>To start a conversation</p>
                </div>
              }
            </div>
          </div>
      </LayoutPrincipal>
    </div>
  )
}

export default InboxPage