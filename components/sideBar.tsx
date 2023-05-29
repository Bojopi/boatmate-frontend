import Link from "next/link";


export type SideProps = {
    activeOption: any;
    activeSideOption: any;
    setActiveSideOption: any;
    user: any;
}

const SideBarComponent: React.FC<SideProps> = ({ 
    user,
    activeOption,
    activeSideOption,
    setActiveSideOption
 }) => {

  const handleSideOptionClick = (option: string) => {
    setActiveSideOption(option)
 }

  return (
    <div className='w-72 h-full shrink-0 bg-white rounded-md shadow-md border'>
        {
        activeOption === 'welcome' ?
                <ul>
                    <Link href={'/welcome'}>
                      <li 
                      onClick={() => handleSideOptionClick('profiles')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'profiles' ? 'active-side-item' : null}`}>
                          Profile
                      </li>
                    </Link>
                </ul>
        : activeOption === 'users' ?
                <ul>
                    <Link href={'/welcome/users'}>
                      <li 
                      onClick={() => handleSideOptionClick('users')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'users' ? 'active-side-item' : null}`}>
                            Users
                      </li>
                    </Link>
                    <Link href={'/welcome/roles'}>
                      <li 
                      onClick={() => handleSideOptionClick('roles')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'roles' ? 'active-side-item' : null}`}>
                          Roles
                      </li>
                    </Link>
                </ul>
        : activeOption === 'providers' ?
                <ul>
                    <Link href={'/welcome/providers'}>
                      <li 
                      onClick={() => handleSideOptionClick('providers')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'providers' ? 'active-side-item' : null}`}>
                          Providers
                      </li>
                    </Link>
                    <Link href={'/welcome/services'}>
                    <li 
                    onClick={() => handleSideOptionClick('services')}
                    className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'services' ? 'active-side-item' : null}`}>
                          Services
                      </li>
                    </Link>
                    <Link href={'/welcome/categories'}>
                      <li 
                      onClick={() => handleSideOptionClick('categories')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'categories' ? 'active-side-item' : null}`}>
                          Categories
                      </li>
                    </Link>
                    <Link href={'/welcome/ratings'}>
                      <li 
                      onClick={() => handleSideOptionClick('ratings')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'ratings' ? 'active-side-item' : null}`}>
                          Ratings
                      </li>
                    </Link>
                    <Link href={'/welcome/service-history'}>
                      <li 
                      onClick={() => handleSideOptionClick('service_history')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'service_history' ? 'active-side-item' : null}`}>
                          Service History
                      </li>
                    </Link>
                </ul>
        : activeOption === 'customers' ?
              <ul>
                  <Link href={'/welcome/customers'}>
                    <li 
                    onClick={() => handleSideOptionClick('customers')}
                    className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'customers' ? 'active-side-item' : null}`}>
                        Customers
                    </li>
                  </Link>
                  <Link href={'/welcome/boats'}>
                    <li 
                    onClick={() => handleSideOptionClick('boats')}
                    className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'boats' ? 'active-side-item' : null}`}>
                        Boats
                    </li>
                  </Link>
                </ul>
        : activeOption === 'leads' ?
                <ul>
                    <Link href={'/welcome/leads'}>
                      <li 
                      onClick={() => handleSideOptionClick('messages')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'leads' ? 'active-side-item' : null}`}>
                            Messages
                      </li>
                    </Link>
                    <Link href={'/welcome/applications'}>
                      <li 
                      onClick={() => handleSideOptionClick('applications')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'applications' ? 'active-side-item' : null}`}>
                        Applications
                      </li>
                    </Link>
                    <div className="w-full px-5 py-3 border-b">
                      <p className="text-[#109EDA]">Opportunities</p>
                      <ul>
                        <Link href={'/welcome/pendings'}>
                          <li 
                          onClick={() => handleSideOptionClick('pendings')}
                          className={`w-full flex items-top pl-5 py-3 cursor-pointer text-gray-500 text-sm hover:text-gray-700 side-item ${activeSideOption === 'pendings' ? 'active-side-item' : null}`}>
                            <i className="pi pi-circle-fill w-3 h-3 text-sky-300 pt-[5px] mr-3"></i> Pending
                          </li>
                        </Link>
                        <Link href={'/welcome/jobs/confirmed'}>
                          <li 
                          onClick={() => handleSideOptionClick('confirmed')}
                          className={`w-full flex items-top pl-5 py-3 cursor-pointer text-gray-500 text-sm hover:text-gray-700 side-item ${activeSideOption === 'confirmed' ? 'active-side-item' : null}`}>
                            <i className="pi pi-circle-fill w-3 h-3 text-sky-300 pt-[5px] mr-3"></i> Job confirmed
                          </li>
                        </Link>
                        <Link href={'/welcome/jobs/done'}>
                          <li 
                          onClick={() => handleSideOptionClick('done')}
                          className={`w-full flex items-top pl-5 py-3 cursor-pointer text-gray-500 text-sm hover:text-gray-700 side-item ${activeSideOption === 'done' ? 'active-side-item' : null}`}>
                            <i className="pi pi-circle-fill w-3 h-3 text-sky-300 pt-[5px] mr-3"></i> Job done
                          </li>
                        </Link>
                        <Link href={'/welcome/jobs/hired'}>
                          <li 
                          onClick={() => handleSideOptionClick('hired')}
                          className={`w-full flex items-top pl-5 py-3 cursor-pointer text-gray-500 text-sm hover:text-gray-700 side-item ${activeSideOption === 'hired' ? 'active-side-item' : null}`}>
                            <i className="pi pi-circle-fill w-3 h-3 text-sky-300 pt-[5px] mr-3"></i> Not hired
                          </li>
                        </Link>
                      </ul>
                    </div>
                </ul>
        : activeOption === 'reviews' ?
                <ul>
                    <Link href={`/welcome/ratings/${user.idProvider}`}>
                      <li 
                      onClick={() => handleSideOptionClick('ratings')}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'ratings' ? 'active-side-item' : null}`}>
                          Ratings
                      </li>
                    </Link>
                </ul>
        : null
        }
    </div>
  )
}

export default SideBarComponent;