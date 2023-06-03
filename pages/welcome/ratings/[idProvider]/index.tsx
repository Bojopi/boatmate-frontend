import LayoutAdmin from '@/components/layoutAdmin'
import React, {useState, useEffect, useRef} from 'react'
import { DataView } from 'primereact/dataview';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { Ratings } from '@/interfaces/interfaces';
import { Ratings as Rtng } from '@/hooks/rating';
import { Avatar } from 'primereact/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { Rating as RatingComponent } from 'primereact/rating';
import { formatDate } from '@/functions/date';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { isSameDay, isWithinInterval, setHours, setMinutes, setSeconds, toDate } from 'date-fns';
import Edit from './edit';

const RatingIndex: React.FC = () => {
    const { getRatingProvider, changeVisible } = Rtng();

    const router = useRouter();

    const [ratings, setRatings] = useState<Ratings[]>([]);
    const [filterRating, setFilterRating] = useState<Ratings[]>([]);

    const [dateIni, setDateIni] = useState<Date | null>(null);
    const [dateEnd, setDateEnd] = useState<Date | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        setLoading(true);
        if(router.query.idProvider) {
            getRatings(Number(router.query.idProvider));
        }
    }, [router.query.idProvider]);

    const getRatings = async (idProvider: number) => {
        const response = await getRatingProvider(idProvider);
        if(response.status == 200) {
            setRatings(response.data.rating);
            setFilterRating(response.data.rating);
            setLoading(false);
        }
    }

    const filterRatings = (initDate: Date, endDate: Date) => {

        const init = new Date(initDate)
        const end = setSeconds(setMinutes(setHours(new Date(endDate), 23), 59), 59);

        if(initDate != null && endDate != null) {
            const listRatings = ratings.filter((item: Ratings) => {
                const date = new Date(item.rating_date)
                return isWithinInterval(toDate(date), {start: toDate(init), end: toDate(end)})
            })

            setFilterRating(listRatings)
        } else if(initDate || endDate) {
            const listRatings = ratings.filter((item: Ratings) => {
                const date = new Date(item.rating_date)
                return isSameDay(toDate(date), toDate(init || end))
            })

            setFilterRating(listRatings)
        } else {
            setFilterRating(ratings)
        }
    }

    const itemTemplate = (rating: Ratings) => {
        return (
            <div className="w-full p-3">
                <div className="w-full border border-gray-300 rounded-md shadow-md">
                    <div className="w-full flex flex-col gap-3 p-5">
                        <div className='w-full flex justify-start items-center gap-5'>
                        {
                            rating.person_image != null ?
                                <Avatar image={rating.person_image} shape="circle" className='w-8 h-8' />
                                :
                                <FontAwesomeIcon icon={faCircleUser} className='w-8 h-8' style={{color: "#c2c2c2"}} />
                        }
                            <p className='font-medium'>{rating.person_name} {rating.lastname}</p>
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <p className='w-1/2'>{rating.service_name}</p>
                            <p className='w-1/2 pl-5 border-l-2'>{rating.provider_name}</p>
                        </div>
                        <div className="w-full text-sm">
                            <p className='font-medium'>Review:</p>
                            <p>{rating.review}</p>
                        </div>
                        <div className='w-full flex justify-end'>
                            <RatingComponent value={rating.rating} readOnly cancel={false} />
                        </div>
                        <div className="w-full flex items-center justify-between">
                            <p className='text-sm'>Date: {formatDate(String(rating.rating_date))}</p>
                            <div className='flex items-center justify-end gap-3'>
                                {
                                    rating.provider_visible ?
                                    <Edit type='ratingprov' idRating={Number(rating.id_rating)} ratings={ratings} setRatings={setRatings} toast={toast} setLoading={setLoading} />
                                    : null
                                }
                                <Button 
                                type='button' 
                                icon={rating.provider_visible ? 'pi pi-eye' : 'pi pi-eye-slash'} 
                                rounded 
                                className={rating.provider_visible ? 'p-button-primary' : 'p-button-secondary'}
                                tooltip='Change visibility' 
                                tooltipOptions={{position: 'top'}}
                                disabled={loading}
                                onClick={() => {
                                    const data = {
                                        provider_visible: !rating.provider_visible
                                    }
                                    setLoading(true);
                                    changeVisible(Number(rating.id_rating), data, filterRating, setFilterRating, toast, setLoading);
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const header = () => {
        return (
            <div className='flex justify-between items-center gap-3 py-2'>
                <p className='uppercase font-bold text-sm md:text-base'>Ratings</p>
                <div className='flex items-center gap-1 md:gap-3'>
                    <span className="p-float-label">
                        <Calendar inputId="start_date" value={dateIni} onChange={(e: any) => setDateIni(e.value)} />
                        <label htmlFor="start_date" className='text-sm'>Start date</label>
                    </span>
                    <span className="p-float-label">
                        <Calendar inputId="end_date" value={dateEnd} onChange={(e: any) => setDateEnd(e.value)} />
                        <label htmlFor="end_date" className='text-sm'>End date</label>
                    </span>
                    <Button type='button' icon='pi pi-search' text onClick={() => filterRatings(dateIni!, dateEnd!)} />
                </div>
            </div>
        )
    };

    const paginator = {
        layout: 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
        CurrentPageReport: (options: any) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            );
        }
    };

  return (
    <LayoutAdmin>
        <Toast ref={toast} />
        <div className='w-full h-full'>
            <DataView
            value={filterRating}
            loading={loading}
            itemTemplate={itemTemplate}
            paginator
            paginatorTemplate={paginator}
            rows={10}
            layout={'grid'}
            header={header()}
            emptyMessage={'No ratings found'}
            className='min-h-full' />
        </div>
    </LayoutAdmin>
  )
}

export default RatingIndex