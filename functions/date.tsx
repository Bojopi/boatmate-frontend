import {format} from "date-fns";
import { enUS } from "date-fns/locale";

export const formatDate = (date: string) => {
    const newDate = format(new Date(date), 'dd MMMM, yyyy', {locale: enUS})
    return newDate
}

export const formatDateFirstMonth = (date: string) => {
    const newDate = format(new Date(date), 'MMMM dd, yyyy', {locale: enUS})
    return newDate
}

export const formatDateDash = (date: string) => {
    const newDate = format(new Date(date), 'dd/MM/yyyy', {locale: enUS})
    return newDate
}

export const formatDateHour = (date: string) => {
    const newDate = format(new Date(date), 'dd MMMM, yyyy hh:mm a', {locale: enUS})
    return newDate
}