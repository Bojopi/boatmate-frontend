import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';


export type SideProps = {
    activeOption: any;
    activeSideOption: any;
    setActiveSideOption: any;
    user: any;
    menuList: any;
}

const SideBarComponent: React.FC<SideProps> = ({ 
    user,
    activeOption,
    activeSideOption,
    setActiveSideOption,
    menuList
 }) => {

  const [subMenu, setSubMenu] = useState<any[]>([]);

  const router = useRouter();

  const fillSubMenu = () => {
    menuList.map((item: any, i: number) => {
      if(activeOption == i) {
        setSubMenu(item.items)
      }
    })
  }

  useEffect(() => {
    fillSubMenu();
    validateRoute();
  }, [user, activeOption]);

  const validateRoute = () => {
    subMenu.map((item: any, i: number) => {
      if(router.pathname == item.url) {
        setActiveSideOption(i)
      }
    })
  }

  return (
    <div className='w-72 h-full hidden md:block shrink-0 bg-white rounded-md shadow-md border'>
      <ul>
        {
          subMenu.map((item: any, i: number) => {
            return (
              <>
                {
                  item.items == null && item.url != null ? 
                  <Link key={i} href={item.label == 'Ratings' ? item.url.replace('[idProvider]', String(user.idProvider)) : item.url}>
                      <li 
                      onClick={() => setActiveSideOption(i)}
                      className={`w-full px-5 py-3 border-b cursor-pointer text-gray-500 font-medium hover:text-black hover:underline hover:underline-offset-4 side-item ${activeSideOption === i ? 'active-side-item' : null}`}>
                          {item.label}
                      </li>
                    </Link>
                  : 
                  <div key={i} className="w-full px-5 py-3 border-b">
                      <p className="text-[#109EDA]">{item.label}</p>
                      <ul>
                        {
                          item.items.map((child: any, x: number) => {
                            return (
                              <Link key={x} href={child.url}>
                                <li
                                className={`w-full flex items-top pl-5 py-3 cursor-pointer text-gray-500 text-sm hover:text-gray-700 side-item`}>
                                  <i className="pi pi-circle-fill w-3 h-3 text-sky-300 pt-[5px] mr-3"></i> {child.label}
                                </li>
                              </Link>
                            )
                          })
                        }
                      </ul>
                    </div>
                }
              </>
            )
          })
        }
      </ul>
    </div>
  )
}

export default SideBarComponent;