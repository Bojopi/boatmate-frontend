import React from 'react';
import { TabMenu, TabMenuTabChangeEvent } from 'primereact/tabmenu';

export type MenuProps = {
    activeIndex: number;
    setActiveIndex: (option: number) => void;
}

const MenuProgressComponent: React.FC<MenuProps> = ({activeIndex = 1, setActiveIndex}) => {

    const items = [
        {label: 'Find a service', url: '/category/detailing'},
        {label: 'In progress'},
        {label: 'Finished'}
    ]

  return (
    <div className='w-full flex justify-center'>
        <TabMenu 
        model={items} 
        activeIndex={activeIndex}
        onTabChange={(e: TabMenuTabChangeEvent) => setActiveIndex(e.index)} />
    </div>
  )
}

export default MenuProgressComponent