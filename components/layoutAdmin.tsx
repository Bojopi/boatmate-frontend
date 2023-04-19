import React from 'react'

const LayoutAdmin = (props: any) => {
    return (
        <>
         <main className='w-full min-h-[360px] bg-white p-5 rounded-md shadow-md'>
            {props.children}
         </main>
        </>
     );
}

export default LayoutAdmin;