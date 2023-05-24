import { MenuContext } from "@/context/MenuContext";
import Link from "next/link";
import {useContext} from 'react';


export type SideProps = {
    activeSideOption: any;
    onSideOptionClick: any;
    user: any;
}

const SideBarComponent: React.FC<SideProps> = ({ 
    user,
    activeSideOption,
    onSideOptionClick
 }) => {

  const { activeOption } = useContext(MenuContext);

  return (
    <div className='w-72 h-full shrink-0 bg-white rounded-md shadow-md border'>
        {
        activeOption === 'welcome' || activeOption === '/welcome' ?
                <ul>
                    <Link href={'/welcome'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'profiles' ? 'active-side-item' : null}`}>
                          Profile
                      </li>
                    </Link>
                </ul>
        : activeOption === 'users' || activeOption == '/welcome/users' ?
                <ul>
                    <Link href={'/welcome/users'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'users' ? 'active-side-item' : null}`}>
                            Users
                      </li>
                    </Link>
                    <Link href={'/welcome/roles'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'roles' ? 'active-side-item' : null}`}>
                          Roles
                      </li>
                    </Link>
                </ul>
        : activeOption === 'providers' || activeOption == '/welcome/providers' ?
                <ul>
                    <Link href={'/welcome/providers'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'providers' ? 'active-side-item' : null}`}>
                          Providers
                      </li>
                    </Link>
                    <Link href={'/welcome/services'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'services' ? 'active-side-item' : null}`}>
                          Services
                      </li>
                    </Link>
                    <Link href={'/welcome/categories'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'categories' ? 'active-side-item' : null}`}>
                          Categories
                      </li>
                    </Link>
                    <Link href={'/welcome/ratings'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'ratings' ? 'active-side-item' : null}`}>
                          Ratings
                      </li>
                    </Link>
                    <Link href={'/welcome/service-history'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'service_history' ? 'active-side-item' : null}`}>
                          Service History
                      </li>
                    </Link>
                </ul>
        : activeOption === 'customers' || activeOption == '/welcome/customers' ?
              <ul>
                  <Link href={'/welcome/customers'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'customers' ? 'active-side-item' : null}`}>
                        Customers
                    </li>
                  </Link>
                  <Link href={'/welcome/boats'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'boats' ? 'active-side-item' : null}`}>
                        Boats
                    </li>
                  </Link>
                </ul>
        : activeOption === 'leads' || activeOption === '/welcome/leads' ?
                <ul>
                    <Link href={'/welcome/leads'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'leads' ? 'active-side-item' : null}`}>
                            Messages
                      </li>
                    </Link>
                    <Link href={'/welcome/applications'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'applications' ? 'active-side-item' : null}`}>
                        Applications
                      </li>
                    </Link>
                    <div className="w-full px-5 py-3 border-b">
                      <p className="text-[#109EDA]">Opportunities</p>
                      <ul>
                        <Link href={'/welcome/pendings'}>
                          <li className={`w-full flex items-top pl-5 py-3 cursor-pointer text-gray-500 text-sm hover:text-gray-700 side-item ${activeSideOption === 'pendings' ? 'active-side-item' : null}`}>
                            <i className="pi pi-circle-fill w-3 h-3 text-sky-300 pt-[5px] mr-3"></i> Pending
                          </li>
                        </Link>
                        <Link href={'/welcome/jobs/confirmed'}>
                          <li className={`w-full flex items-top pl-5 py-3 cursor-pointer text-gray-500 text-sm hover:text-gray-700 side-item ${activeSideOption === 'quotes' ? 'active-side-item' : null}`}>
                            <i className="pi pi-circle-fill w-3 h-3 text-sky-300 pt-[5px] mr-3"></i> Job confirmed
                          </li>
                        </Link>
                        <Link href={'/welcome/jobs/done'}>
                          <li className={`w-full flex items-top pl-5 py-3 cursor-pointer text-gray-500 text-sm hover:text-gray-700 side-item ${activeSideOption === 'quotes' ? 'active-side-item' : null}`}>
                            <i className="pi pi-circle-fill w-3 h-3 text-sky-300 pt-[5px] mr-3"></i> Job done
                          </li>
                        </Link>
                        <Link href={'/welcome/jobs/hired'}>
                          <li className={`w-full flex items-top pl-5 py-3 cursor-pointer text-gray-500 text-sm hover:text-gray-700 side-item ${activeSideOption === 'quotes' ? 'active-side-item' : null}`}>
                            <i className="pi pi-circle-fill w-3 h-3 text-sky-300 pt-[5px] mr-3"></i> Not hired
                          </li>
                        </Link>
                      </ul>
                    </div>
                </ul>
        : activeOption === 'reviews' || activeOption === '/welcome/ratings/[idProvider]' ?
                <ul>
                    <Link href={`/welcome/ratings/${user.idProvider}`}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'ratings' ? 'active-side-item' : null}`}>
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