import LayoutAdmin from '@/components/layoutAdmin'
import { Auth } from '@/hooks/auth'
import { Profile, Ratings as RatingInterface } from '@/interfaces/interfaces'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable, DataTableFilterMeta } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState, useRef } from 'react'
import { formatDateHour } from '@/functions/date'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import Link from 'next/link'
import Spinner from '@/components/spinner';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { Ratings } from '@/hooks/rating'
import { Avatar } from 'primereact/avatar'
import { Rating } from 'primereact/rating'
import { useRouter } from 'next/router'
import { BreadCrumb } from 'primereact/breadcrumb';
import { generateBreadcrumbItems } from '@/functions/breadcrumb'

const Index = () => {
    const { getRatingProvider, changeVisible, getAllRatigns } = Ratings();
    const { getUserAuthenticated } = Auth();

    const router = useRouter();

    // const [itemsBreadCrumb, setItemsBreadCrumb] = useState<any[]>([]);

    const [ratings, setRatings] = useState<RatingInterface[]>([]);
    const [filterRating, setFilterRating] = useState<RatingInterface[]>([]);
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

    const [hiddenBread, setHiddenBread] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null)

    const [filters, setFilters] = useState<DataTableFilterMeta | any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        person_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        service_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        review: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        rating_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS}]}
    });

    const home = {icon: 'pi pi-home'}

    const breadcrumbItems = [
        ...generateBreadcrumbItems(router.asPath)
    ];

    const getUserAuth = async () => {
        try {
            const response = await getUserAuthenticated();
            if(response.status == 200) {
                setUser(response.data.user)
                if(response.data.user.role != 'PROVIDER') {
                    getAllRatigns(setRatings, setFilterRating, setLoading);
                } else {
                    getRatings(response.data.user.idProvider);
                }
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getRatings = async (idProvider: number) => {
        try {
            const response = await getRatingProvider(idProvider);
            if(response.status == 200) {
                const ratingList = response.data.rating;
                setRatings(ratingList);
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setLoading(true);
        if(router.query.idProvider) {
            getRatings(Number(router.query.idProvider))
            if(user && user.role != 'PROVIDER') {
                setHiddenBread(false);
            }
        } else {
            getUserAuth();
        }
    }, [router.query.idProvider]);

    const changeVisibility = (idRating: number, state: boolean) => {
        setLoading(true);
        const data = {provider_visible: state}
        changeVisible(idRating, data, ratings, setRatings, toast, setLoading);
    }

    const formatStatusView = (state: boolean) => {
        if(state) {
            return 'Visible'
        } else {
            return 'Hidden'
        }
    }

    const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div className='w-full flex justify-end'>
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Search user" className='text-sm rounded-2xl px-6 py-3 opacity-60 shadow-lg text-gray-900/50' />
            </div>
        );
    };

    const emptyMessageTemplate = () => {
        return (
            <div className='w-full flex justify-center'>
                <p>No ratings found.</p>
            </div>
        );
    };

    const customerBodyTemplate = (rowData: RatingInterface) => {
        return (
            <div className='flex items-center gap-2'>
                {
                    rowData.person_image != null ?
                    <img src={`${rowData.person_image}`} alt={`${rowData.person_name}`} className='w-10 h-10 rounded-full' />
                    :
                    <Avatar icon="pi pi-image" size='large' shape="circle" />
                }
                <p>{rowData.person_name} {rowData.lastname}</p>
            </div>
        );
    };
    
    const ratingBodyTemplate = (rowData: RatingInterface) => {
        return (
            <Rating value={rowData.rating} cancel={false} readOnly />
        );
    };
    
    const viewBodyTemplate = (rowData: RatingInterface) => {
        return (
            <div className={`px-3 py-0.5 rounded-md justify-center items-center gap-2.5 inline-flex ${rowData.provider_visible ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`text-xs font-semibold ${rowData.provider_visible ? 'text-green-800' : 'text-red-800'}`}>{formatStatusView(rowData.provider_visible)}</p>
            </div>
        );
    };
    
    const dateBodyTemplate = (rowData: RatingInterface) => {
        return (
            <p className='text-xs'>{formatDateHour(String(rowData.rating_date))}</p>
        );
    };
    
    const actionsBodyTemplate = (rowData: RatingInterface) => {
        return (
            <div className='flex items-center justify-between'>
                <Tooltip target=".view-btn" className='text-xs' />
                <Link href={''} onClick={() => changeVisibility(rowData.id_rating, !rowData.provider_visible)} data-pr-tooltip={`${rowData.provider_visible ? 'Hide' : 'Show'}`} data-pr-position='top' className='w-8 h-8 rounded-md border border-gray-900/50 flex items-center justify-center view-btn'>
                    {
                        rowData.provider_visible ?
                        <AiFillEyeInvisible className='w-4 h-4'/>
                        :
                        <AiFillEye className='w-4 h-4'/>
                    }
                </Link>
            </div>
        );
    };

  return (
    <LayoutAdmin>
        <Spinner loading={loading} />
        <Toast ref={toast} />
        <div className='w-full p-5'>
            <BreadCrumb model={breadcrumbItems} home={home} hidden={hiddenBread} className='border-none' />
            <h1 className='text-gray-900/75 text-xl font-semibold leading-loose'>Reviews</h1>
            <div className="text-gray-900/50 text-sm font-normal leading-none mt-3">Explore Customer Ratings and Reviews.</div>
            <div className='mt-5'>
                <DataTable value={ratings} rows={8} header={renderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        globalFilterFields={['person_name', 'service_name', 'review', 'rating_date']} dataKey="id_rating"
                        stateStorage="session" stateKey="dt-state-demo-local" emptyMessage={emptyMessageTemplate} tableStyle={{ minWidth: '50rem' }}
                        paginator rowsPerPageOptions={[5, 10, 25, 50]} removableSort className='text-sm'>
                    <Column field="person_name" header="User" body={customerBodyTemplate} sortable style={{ width: '20%' }}></Column>
                    <Column field="service_name" header="Service" sortable style={{ width: '10%' }}></Column>
                    <Column field="rating" header="Rating" body={ratingBodyTemplate} sortable style={{ width: '4%' }}></Column>
                    <Column field="review" header="Review" sortable style={{ width: '30%' }}></Column>
                    <Column field="rating_date" header="Date" body={dateBodyTemplate} sortable style={{ width: '15%' }}></Column>
                    <Column field="provider_visible" header="State View" body={viewBodyTemplate} sortable style={{ width: '10%' }}></Column>
                    <Column field="actions" body={actionsBodyTemplate} style={{ width: '10%' }}></Column>
                </DataTable>
            </div>
        </div>
    </LayoutAdmin>
  )
}

export default Index
