import { axios } from "@/config/axios";


export const Conversations = () => {

    const getMessages = (idContract: number) => axios.get(`/conversation/${idContract}`);

    const getConversationsCustomer = (idCustomer: number) => axios.get(`/conversation-customer/${idCustomer}`);
    
    const getConversationsProvider = (idProvider: number) => axios.get(`/conversation-provider/${idProvider}`);

    const sendMessage = (idContract: number, data: any) => axios.post(`/new-message/${idContract}`, data)


    return {
        getMessages,
        sendMessage,
        getConversationsCustomer,
        getConversationsProvider,
    }
}

