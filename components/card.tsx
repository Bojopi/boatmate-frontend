import React from 'react';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

type CardProps = {
    title?:             string;
    btnLabel?:          string;
    image?:             string;
    footerVisibility:   boolean;
    width?:             string;
    children:           React.ReactNode;
}

const CardComponent: React.FC<CardProps> = (
    {
        title,
        btnLabel,
        children,
        image,
        footerVisibility    =   true,
        width               =   'w-full'
    }) => {

    const footer = (
        <div className="flex flex-wrap justify-end gap-2">
            <Button label={btnLabel} icon="pi pi-check" className='p-button p-button-secondary' />
        </div>
    );

    return(
        <div className="card flex flex-col lg:flex-row">
            <div className={image ? 'w-full h-40 lg:h-full lg:w-2/4 overflow-hidden shadow-sm shadow-gray-500 rounded-t-md lg:rounded-l-md' : 'hidden'}>
                <img src={image} className={'w-full h-full object-cover'} />
            </div>
            <Card title={title} footer={footerVisibility ? footer : ''} className={image ? `${width} lg:h-full lg:flex lg:items-center rounded-t-none lg:rounded-l-none` : `${width} h-full flex items-center`}>
                {children}
            </Card>
        </div>
    )
};

export default CardComponent;