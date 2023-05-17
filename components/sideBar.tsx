import Link from "next/link";


export type SideProps = {
    index: any;
    sideItem: any;
    activeSideItem: any;
}

const SideBarComponent: React.FC<SideProps> = ({ 
    index = 0, 
    sideItem = 0,
    activeSideItem
 }) => {

  return (
    <div className='w-72 h-full shrink-0 bg-white rounded-md shadow-md border'>
        {
          index === 0 ?
              <ul>
                  <Link href={'/welcome'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 0 ? 'active-side-item' : null}`} onClick={activeSideItem} id='profiles'>
                        Profile
                    </li>
                  </Link>
              </ul>
          : index === 1 ?
              <ul>
                  <Link href={'/welcome/users'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 0 ? 'active-side-item' : null}`} onClick={activeSideItem} id='users'>
                          Users
                    </li>
                  </Link>
                  <Link href={'/welcome/roles'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 1 ? 'active-side-item' : null}`} onClick={activeSideItem}  id='roles'>
                        Roles
                    </li>
                  </Link>
              </ul>
          : index === 2 ?
              <ul>
                  <Link href={'/welcome/providers'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 0 ? 'active-side-item' : null}`} onClick={activeSideItem}  id='providers'>
                        Providers
                    </li>
                  </Link>
                  <Link href={'/welcome/services'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 1 ? 'active-side-item' : null}`} onClick={activeSideItem}  id='services'>
                        Services
                    </li>
                  </Link>
                  <Link href={'/welcome/categories'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 2 ? 'active-side-item' : null}`} onClick={activeSideItem}  id='categories'>
                        Categories
                    </li>
                  </Link>
                  <Link href={'/welcome/service-history'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 3 ? 'active-side-item' : null}`} onClick={activeSideItem}  id='service_history'>
                        Service History
                    </li>
                  </Link>
              </ul>
          : index === 3 ?
          <ul>
                  <Link href={'/welcome/boats'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 0 ? 'active-side-item' : null}`} onClick={activeSideItem}  id='boats'>
                        Boats
                    </li>
                  </Link>
                  <Link href={'/welcome/customers'}>
                    <li className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${sideItem === 1 ? 'active-side-item' : null}`} onClick={activeSideItem}  id='customers'>
                        Customers
                    </li>
                  </Link>
              </ul>
          : null
        }
    </div>
  )
}

export default SideBarComponent;