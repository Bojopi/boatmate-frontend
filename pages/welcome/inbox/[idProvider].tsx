import React, {useState, useEffect, useRef} from 'react'
import LayoutPrincipal from '@/components/layoutPrincipal'
import { useRouter } from 'next/router';
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { ContractProvider, Conversation, Message, Profile } from '@/interfaces/interfaces';
import { formatDateDash, formatDateHourDash } from '@/functions/date';
import { Maps } from '@/hooks/maps';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Conversations } from '@/hooks/conversation';
import { Auth } from '@/hooks/auth';
import socket from '@/socket.js';
import LayoutAdmin from '@/components/layoutAdmin';

const InboxPage = () => {
  const { getUserAuthenticated } = Auth();
  const { getAddress } = Maps();
  const { getConversationsProvider, sendMessage } = Conversations();

  const [contracts, setContracts] = useState<ContractProvider[]>([]);
  const [conversations, setConversations] = useState<{[contract: number]: Conversation}>({});
  const [messages, setMessages] = useState<{[conversation: number]: Message[]}>([])
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
  const [indexActive, setIndexActive] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');

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

  const getUser = async () => {
    try {
      const response = await getUserAuthenticated();
      if(response.status == 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getConversations = async (idProvider: number) => {
    try {
      const response = await getConversationsProvider(idProvider);
      if(response.status == 200) {
        let contractList: ContractProvider[] = []
        let conversationList: Conversation[] = []
        for(let item of response.data.conversationsByContract) {
          contractList.push(item.contract);
          setContracts(contractList);

          setConversations({
            ...conversations,
            [item.contract.id_contract]: item.conversations
          });

          setMessages({
            ...messages,
            [item.conversations.id_conversation]: item.messages
          })
        }
        // response.data.conversationsByContract.map((item: any) => {
        //   contractList.push(item.contract);
        //   setContracts(contractList);
          
        //   console.log(item)
        //   setConversations({
        //     ...conversations,
        //     [item.contract.id_contract]: item.conversations
        //   });

        //   setMessages({
        //     ...messages,
        //     [item.conversations.id_conversation]: item.messages
        //   })
        // })

        setTimeout(() => {
          const messageContainer = document.getElementById('message-container');
          if(messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight
          }
        },0)
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
      setConversations([]);
      setLoading(false)
    }
  };

  useEffect(() => {
    setLoading(true)
    if(router.query.idProvider) {
      getConversations(Number(router.query.idProvider));
      getUser();
    }
  }, [router.query.idProvider]);

  useEffect(() => {
    if(user.uid != 0) {
      socket.emit('user_connected', user.uid);
    }
  }, [user]);

  useEffect(() => {
    socket.on('message', recieveMessage);

    return () => {socket.off('message', recieveMessage)}
  }, [])

  useEffect(() => {
    // if(conversations.length > 0 &&
    //   conversations[indexActive] &&
    //   conversations[indexActive].conversations &&
    //   messages[conversations[indexActive].conversations.id_conversation] &&
    //   messages[conversations[indexActive].conversations.id_conversation].length > 0) {
    //   setMessages({
    //     ...messages,
    //     [conversations[indexActive].conversations.id_conversation]: conversations[indexActive].messages
    //   })
    // }
    setTimeout(() => {
      const messageContainer = document.getElementById('message-container');
      if(messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight
      }
    },0)
  }, [indexActive, conversations])

  const sendMessages = (e: any) => {
    e.preventDefault();

    // if(conversations.length > 0) {
    //   const contractId = conversations[indexActive].contract.id_contract;

    //   const formData = {
    //     messageText: message,
    //     date: new Date().toISOString(),
    //     providerId: Number(router.query.idProvider)
    //   };
    //   sendMessageToCustomer(contractId, formData);

    //   setMessage('');
    // }
  }

  const sendMessageToCustomer = async (idContract: number, data: any) => {
    try {
      const response = await sendMessage(idContract, data);
      if(response.status == 200) {
        console.log(response.data)
        // setConversations(prevConversations => {
        //   const updatedConversations = [...prevConversations];
        //   updatedConversations[indexActive].messages.push(response.data.message);
        //   return updatedConversations;
        // });

        socket.emit('message', response.data.message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const recieveMessage = (message: any) => {
    console.log('viene de customer', message)
    // if(conversations.length > 0) {
    //   setConversations(prevConversations => {
    //     const updatedConversations = [...prevConversations];
    //     updatedConversations[indexActive].messages.push(message);
    //     return updatedConversations;
    //   });
    // }
  };

  return (
      <LayoutAdmin>
          <Spinner loading={loading} />
          <Toast ref={toast} />
          <div className='w-full p-5'>
            <p className='w-full font-semibold'>Inbox</p>
            <div className='w-full h-[calc(100vh-20vh)] mt-8 flex gap-5'>
              <div className='h-full w-96 border rounded-xl shrink-0 overflow-x-hidden overflow-y-auto'>
                {
                  contracts.length > 0 ?
                  contracts.map((item: ContractProvider, i: number) => (
                    <div id={String(i)} key={i} className={`w-full h-auto max-h-44 border flex items-start gap-3 p-3 py-4 ${indexActive == i ? 'active-inbox' : ''} cursor-pointer hover:bg-zinc-100`} onClick={() => setIndexActive(i)}>
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
                  contracts[indexActive] && (
                      <div>
                        <div className='w-full flex items-end gap-5'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path id='svg-gear' fill='#000' d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>
                          <div className='w-full flex items-center justify-between'>
                            <div>
                              <p className='text-sm'><span className='text-zinc-500'>{formatDateDash(String(contracts[indexActive].contract_date))}</span> - <span className='text-cyan-600 font-light'>{contracts[indexActive].person_name} {contracts[indexActive].lastname}</span></p>
                              <p className='text-lg'>{contracts[indexActive].service_name}</p>
                            </div>
                            <p className='text-teal-600 text-2xl font-semibold'>$ {contracts[indexActive].contract_price || 0}</p>
                          </div>
                        </div>
                        <div className='ml-11 mt-2 flex flex-col gap-3'>
                          <p className={`${setColorStatus(contracts[indexActive].contract_state)} text-sm`} style={{textTransform: 'capitalize'}}>{(contracts[indexActive].contract_state).toLowerCase()}</p>
                          <p className='text-sm text-neutral-600 font-light line-clamp-3'>{contracts[indexActive].contract_description}</p>
                        </div>
                      </div>
                  )
                }
                <form onSubmit={sendMessages}>
                  <div id='message-container' className='w-full h-[350px] p-5 border rounded-tl-xl rounded-tr-xl overflow-y-auto flex flex-col gap-3 text-sm'>
                    {
                      conversations[indexActive] &&
                      messages[conversations[indexActive].id_conversation] &&
                      messages[conversations[indexActive].id_conversation].length > 0 && (
                          messages[conversations[indexActive].id_conversation].map((msg: any, i: number) => (
                            <div 
                            id={`msg-${i}`}
                            key={`st-${i}`} 
                            className={`w-auto ${msg.id_customer ? 'mr-auto' : 'ml-auto'}`}>
                              <p className='text-[10px] text-gray-600/50'>{formatDateHourDash(msg.message_date)}</p>
                              <div
                              className={`py-2 px-3 rounded-xl w-auto ${msg.id_customer ? 'bg-gray-200  rounded-bl-none' : 'bg-sky-200  rounded-br-none'}`}>
                                {msg.message_text}
                              </div>
                            </div>
                          ))
                      )
                    }
                  </div>
                  <div className='w-full flex items-center justify-between'>
                    <InputText type="text" className='w-full' value={message} onChange={(e: any) => setMessage(e.target.value)} />
                    <Button type='submit' label='Send' icon='pi pi-send' disabled={loading} className='w-auto px-5 shrink-0'></Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </LayoutAdmin>
  )
}

export default InboxPage