import Link from 'next/link'

import Layout from '@/components/layout'
import MenuBar from '@/components/menuBar'
import FooterProComponent from '@/components/footer_pro'



const ProPage = () => {

  return (
    <>
    <Layout>
        <MenuBar linkMenu='Sign In' urlMenu='/login' menuItem={false}/>
        <div className='w-full h-[90vh] lg:h-auto grid grid-cols-1 lg:grid-cols-2 lg:mt-24 items-center overflow-hidden bg-[#373A85]'>
            <div className='w-5/6 lg:w-7/12 mx-auto text-white'>
                <p className='text-xl lg:text-3xl font-semibold'>Grow Your Business</p>
                <p className='text-sm lg:text-base font-medium leading-tight mt-5 lg:mt-3'>Increase your exposure to millions of homeowners looking to find local contractors just like you.</p>
                <p className='text-sm lg:text-base font-medium mt-5 lg:mt-3'>Signing up is free and easy. Start today!</p>
                <div className='mt-6'>
                    <Link href={'/pro/list'} className='px-4 py-[10px] bg-white border-white text-black rounded-lg text-sm font-medium shadow-sm hover:bg-gray-200' >List my business</Link>
                </div>
                <div className='flex flex-row gap-2 items-center mt-5 text-sm lg:text-base font-medium'>
                    <p>Already have an account? </p>
                    <div className='border-b border-b-white flex flex-row items-center gap-2 transform-none hover:gap-4 transition-all'>
                        <Link href={''} >Sign in here</Link>
                        <span className='pi pi-arrow-right'></span>
                    </div>
                </div>
            </div>
            <img src="https://images.squarespace-cdn.com/content/v1/634f43133040660154fd193a/54c3355d-4b60-4ed9-a168-e45abec1ea61/nicol-JrMzz7jUD5s-unsplash.png" className='w-full hidden lg:block' alt="head" />
        </div>
        <div className="w-full py-2 lg:py-14 flex flex-col items-center gap-2 text-sm lg:text-lg">
            <p className="tracking-wide">Use these tools to take your business to a new level.</p>
            <Link href={'#features'}> <span className='pi pi-angle-down text-base lg:text-xl animate-bounce'></span></Link>
        </div>
        <div id='features' className="w-5/6 lg:w-2/3 h-auto lg:h-[450px] overflow-hidden mx-auto pt-20 lg:pt-28 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <p className='text-xl lg:text-[25px] font-bold'>Feature your business to new customers</p>
                <p className='text-base lg:text-xl font-medium mt-4'>Manage Your Online Reputation</p>
                <p className='mt-1 text-xs lg:text-sm'>Utilize your Angi profile and our exclusive tools to build a strong online business presence.</p>
                <p className='text-base lg:text-xl font-medium mt-4'>Showcase your work</p>
                <p className='mt-1 text-xs lg:text-sm'>Show off your best projects, and prove that you&apos;re the right business for the job.</p>
                <p className='text-base lg:text-xl font-medium mt-4'>Build Credibility</p>
                <p className='mt-1 text-xs lg:text-sm'>Request reviews and feedback from your customers to establish credibility for your business.</p>
            </div>
            <div className='bg-[url("https://i.postimg.cc/gJrPfDPt/rebecca-sorto-M30w-Qq1-Th-Mw-unsplash.jpg")] bg-no-repeat bg-center flex flex-col justify-between'>
                <div className='p-5'>
                    <span className='py-1 px-3 text-xs rounded-full bg-purple-100 text-violet-800'>Consumer Reviewed</span>
                </div>
                <div className='w-full bg-black/70 text-white py-3 px-5 text-xs'>
                    <p className='text-lg font-medium'>Vintage Kitchen Restoration</p>
                    <div className='flex flex-row gap-3 mt-1'>
                        <p>Cabinet Refacting/Restoration</p>
                        <p><span className='pi pi-calendar text-xs'></span> 2023</p>
                        <p><span className='pi pi-map-marker text-xs'></span> 60606</p>
                    </div>
                    <p className='text-[9px] mt-1'>In this project, we were asked to restore and refurnish a kitchen from the early 1940&apos;s. Older homes come with unique challenges, but we laid out a design plan and execute.</p>
                </div>
            </div>
        </div>
        <div className="w-[90%] lg:w-2/3 mx-auto mt-20 lg:mt-28 flex flex-row gap-10 lg:gap-20">
            <div className='h-auto lg:h-[400px]'>
                <img src="https://pro.angi.com/app/static/fdbb98fab4cc333329cf4a9dbd61e520.png" className='object-contain h-full' alt="phone1" />
            </div>
            <div className='flex flex-col justify-center'>
                <p className='text-base lg:text-[25px] font-bold'>Manage your business like a pro</p>
                <p className='text-sm lg:text-xl font-medium mt-1 lg:mt-4'>Build and Send Quotes</p>
                <p className='mt-1 text-xs lg:text-sm'>We make it easy to build and send job quotes to potential customers.</p>
                <p className='text-sm lg:text-xl font-medium mt-1 lg:mt-4'>Request Payment On the Go</p>
                <p className='mt-1 text-xs lg:text-sm'>Send invoices and take payments, all while you&apos;re on the job.</p>
                <p className='text-sm lg:text-xl font-medium mt-1 lg:mt-4'>Integrate with Your QuickBooks Account</p>
                <p className='mt-1 text-xs lg:text-sm'>Integrate Quickbooks with your Angi Ads account to track and manage all quotes and payments.</p>
            </div>
        </div>
        <div className="w-[90%] lg:w-2/3 mx-auto mt-20 lg:mt-28 flex flex-row gap-10 lg:gap-20">
            <div className='flex flex-col justify-center'>
                <p className='text-base lg:text-[25px] font-bold'>Respond to homeowners using our exclusive tools</p>
                <p className='text-sm lg:text-xl font-medium mt-1 lg:mt-4'>Manage Your Leads</p>
                <p className='mt-1 text-xs lg:text-sm'>Use the Boatmate Ads Lead Board to manage quote requests and claimed deals from start to finish.</p>
                <p className='text-sm lg:text-xl font-medium mt-1 lg:mt-4'>Communicate with Customers</p>
                <p className='mt-1 text-xs lg:text-sm'>Use our convenient Message Center to communicate with Angi homeowners.</p>
                <p className='text-sm lg:text-xl font-medium mt-1 lg:mt-4'>Get notified when you have a lead</p>
                <p className='mt-1 text-xs lg:text-sm'>Set up PUSH or SMS notifications on your phone, so you&apos;re always notified as soon as a new lead comes through.</p>
            </div>
            <div className='h-auto lg:h-[400px]'>
                <img src="https://pro.angi.com/app/static/e201725bf4e996556daee1e0e3321890.png" className='object-contain h-full' alt="phone1" />
            </div>
        </div>

        <div className="w-full mt-5 lg:mt-20 py-10 text-white bg-[#373A85] flex flex-col items-center">
                <p className="text-lg text-center lg:text-3xl font-bold tracking-tight">Opportunity is waiting for you at BoatMate Ads</p>
                <p className='mt-5 text-sm lg:text-base'>Join today to revolutionize the way you do business.</p>
                <button type="button" className="py-2 px-3 mt-8 bg-white text-[#373A85] text-xs lg:text-base font-bold rounded-lg hover:bg-gray-200">Get Started</button>
        </div>

        <FooterProComponent />
    </Layout>
    </>
  )
}

export default ProPage