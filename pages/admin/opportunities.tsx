import Image from 'next/image'
import React from 'react'

const Opportunities = () => {
  return (
    <>
        <div className='w-full min-h-[300px] flex flex-col items-center justify-center'>
            <Image src="https://i.postimg.cc/G3Pg909N/search.png" alt="search" width={80} height={80} />
            <p>After you confirm an opporunity, those direct leads will show up in sent quotes and messages.</p>
        </div>
    </>
  )
}

export default Opportunities