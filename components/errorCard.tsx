
import React from 'react'

const ErrorCard = ({children}: any) => {
  return (
    <div className='w-full min-h-full flex flex-col items-center justify-center px-10'>
        <img src="https://i.postimg.cc/G3Pg909N/search.png" alt="search" width={80} height={80} />
        {children}
    </div>
  )
}

export default ErrorCard