import Link from 'next/link'

import Layout from '@/components/layout'
import MenuBar from '@/components/menuBar'
import FooterComponentThree from '@/components/footer-3'



const ListPage = () => {

  return (
    <>
    <Layout>
        <MenuBar linkMenu='Sign In' urlMenu='/login' menuItem={false}/>
        <div className='w-full h-[90vh] lg:h-auto grid grid-cols-1 lg:grid-cols-2 lg:mt-24 items-center overflow-hidden bg-gray-200'>
            <div className='w-5/6 lg:w-7/12 mx-auto'>
                <p className='text-2xl lg:text-4xl font-bold'>Get Jobs near you.</p>
                <p className='text-xs lg:text-sm leading-tight mt-2 lg:mt-3'>Thousands of projects performed by boat owners every day.</p>
                <div className='mt-5 lg:mt-3 bg-white shadow-md rounded-md p-5'>
                    <p className='text-sm lg:text-base'>What service do you provide?</p>
                    <div className='p-inputgroup mt-3'>
                        <span className="p-inputgroup-addon bg-white border-r-0">
                            <i className="pi pi-search text-[#109EDA] text-sm font-bold"></i>
                        </span>
                        <input type="text" className='w-full p-inputtext rounded-l-none text-sm lg:text-base' placeholder='e.g. Hull Cleaning' />
                    </div>
                    <div className='p-inputgroup mt-2'>
                        <span className="p-inputgroup-addon bg-white border-r-0">
                            <i className="pi pi-map-marker text-[#109EDA] text-sm font-bold"></i>
                        </span>
                        <input type="text" className='w-full p-inputtext rounded-l-none text-sm lg:text-base' placeholder='Tampa, Florida' />
                    </div>
                    <div className='w-full mt-5'>
                        <Link href={'/pro/form-1'} className='flex justify-center items-center py-2 rounded-md w-full bg-[#373A85] text-white text-sm lg:text-base font-medium hover:bg-[#2a2c64]'>Get Started</Link>
                    </div>
                </div>
                <div className='w-full mt-5 text-xs lg:text-sm'>
                    <p className='w-full text-center font-bold'>Problems Registering?</p>
                    <p className='w-full text-center mt-1'>Contact us at <Link href={''} className='text-[#109EDA] font-bold' >(813) 766-7565</Link></p>
                </div>
            </div>
            <img src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/54c3355d-4b60-4ed9-a168-e45abec1ea61/nicol-JrMzz7jUD5s-unsplash.png" className='w-full hidden lg:block' alt="head" />
        </div>
        
        <div className="w-5/6 lg:w-2/3 h-auto lg:h-[350px] overflow-hidden mx-auto mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className='col-span-1 lg:col-span-3'>
                <p className='w-full text-center text-2xl font-bold'>See how BoatMate is different.</p>
            </div>
            <div className='col-span-1'>
                <div className='flex flex-row gap-5'>
                    <img src="https://i.postimg.cc/50FZYCRn/Credit-card-bro.png" width={100} height={100} alt="coins" />
                    <div>
                        <p className='font-bold'>No subscription fees</p>
                        <p className='text-sm'>There&apos;s no charge to join, no annual fees, and no membership fees.</p>
                    </div>
                </div>
            </div>
            <div className='col-span-1'>
                <div className='flex flex-row gap-5'>
                    <img src="https://i.postimg.cc/9M1nKYK8/Customer-feedback-rafiki.png" width={100} height={100} alt="coins" />
                    <div>
                        <p className='font-bold'>Great customers</p>
                        <p className='text-sm'>Hear from customers who choose you, with high intent to hire.</p>
                    </div>
                </div>
            </div>
            <div className='col-span-1'>
                <div className='flex flex-row gap-5'>
                    <img src="https://i.postimg.cc/bvznw7mv/Contact-us-bro.png" width={100} height={100} alt="coins" />
                    <div>
                        <p className='font-bold'>Outstanding support</p>
                        <p className='text-sm'>1:1 help that&apos;s easily accessible, and a simple, flexible refund policy.</p>
                    </div>
                </div>
            </div>
            <div className='col-span-1'>
                <div></div>
            </div>
            <div className='col-span-1'>
                <div></div>
            </div>
        </div>

        <FooterComponentThree />
    </Layout>
    </>
  )
}

export default ListPage