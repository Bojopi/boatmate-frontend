import { axios } from "@/config/axios";


export const Conversations = () => {

    const getMessages = (idContract: number) => axios.get(`/conversation/${idContract}`);

    const sendMessage = (idContract: number, data: any) => axios.post(`/new-message/${idContract}`, data);


    return {
        getMessages,
        sendMessage,
    }
}

