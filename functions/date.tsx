import {format} from "date-fns";
import { enUS } from "date-fns/locale";

export const formatDate = (date: string) => {
    const newDate = format(new Date(date), 'MMMM dd, yyyy', {locale: enUS})
    return newDate
}