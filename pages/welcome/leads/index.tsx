import LayoutAdmin from '@/components/layoutAdmin'
import React from 'react'

const Index = () => {
  return (
    <>
      <LayoutAdmin>
        <div className='w-full min-h-full flex flex-col items-center justify-center'>
            <img src="https://i.postimg.cc/G3Pg909N/search.png" alt="search" width={80} height={80} />
            <p>After you confirm an opportunity, those direct leads will show up in sent quotes and messages.</p>
        </div>
      </LayoutAdmin>
    </>
  )
}

export default Index