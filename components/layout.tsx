import React from 'react'

const Layout = (props: any) => {
    return (
         <main className='w-full absolute top-0 left-0'>
            {props.children}
         </main>
     );
}

export default Layout;