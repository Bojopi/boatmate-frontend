import { MenuContext } from "@/context/MenuContext";
import Link from "next/link";
import {useContext} from 'react';


export type SideProps = {
    activeOption: any;
    activeSideOption: any;
    onSideOptionClick: any;
}

const SideBarComponent: React.FC<SideProps> = ({ 
    // activeOption,
    activeSideOption,
    onSideOptionClick
 }) => {

  const { activeOption } = useContext(MenuContext);

  return (
    <div className='w-72 h-full shrink-0 bg-white rounded-md shadow-md border'>
        {
        activeOption === 'welcome' ?
                <ul>
                    <Link href={'/welcome'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'profiles' ? 'active-side-item' : null}`}>
                          Profile
                      </li>
                    </Link>
                </ul>
        : activeOption === 'users' ?
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
        : activeOption === 'providers' ?
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
        : activeOption === 'customers' ?
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
        : activeOption === 'leads' ?
                <ul>
                    <Link href={'/welcome/leads'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'leads' ? 'active-side-item' : null}`}>
                            Messages
                      </li>
                    </Link>
                    <Link href={'/welcome/quotes'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'quotes' ? 'active-side-item' : null}`}>
                          Sent Quotes
                      </li>
                    </Link>
                    <div className="w-full px-5 py-3 border-b">
                      <p className="text-[#109EDA]">Opportunities</p>
                      <ul>
                        <Link href={'/welcome/leads'}>
                          <li className={`w-full pl-5 py-3 cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'leads' ? 'active-side-item' : null}`}>
                              Messages
                          </li>
                        </Link>
                        <Link href={'/welcome/quotes'}>
                          <li className={`w-full pl-5 py-3 cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 'quotes' ? 'active-side-item' : null}`}>
                              Sent Quotes
                          </li>
                        </Link>
                      </ul>
                    </div>
                </ul>
        : activeOption === 'reviews' ?
                <ul>
                    <Link href={'/welcome/providers'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 0 ? 'active-side-item' : null}`}>
                          Providers
                      </li>
                    </Link>
                    <Link href={'/welcome/services'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 1 ? 'active-side-item' : null}`}>
                          Services
                      </li>
                    </Link>
                    <Link href={'/welcome/categories'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 2 ? 'active-side-item' : null}`}>
                          Categories
                      </li>
                    </Link>
                    <Link href={'/welcome/ratings'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 3 ? 'active-side-item' : null}`}>
                          Ratings
                      </li>
                    </Link>
                    <Link href={'/welcome/service-history'}>
                      <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 4 ? 'active-side-item' : null}`}>
                          Service History
                      </li>
                    </Link>
                </ul>
        : activeOption === 'business' ?
              <ul>
                  <Link href={'/welcome/customers'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 0 ? 'active-side-item' : null}`}>
                        Customers
                    </li>
                  </Link>
                  <Link href={'/welcome/boats'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === 1 ? 'active-side-item' : null}`}>
                        Boats
                    </li>
                  </Link>
                </ul>
        : null
        }
    </div>
  )
}

export default SideBarComponent;