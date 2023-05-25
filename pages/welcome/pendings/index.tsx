import ErrorCard from '@/components/errorCard'
import LayoutAdmin from '@/components/layoutAdmin'
import React from 'react'

const Index = () => {
  return (
    <>
      <LayoutAdmin>
        <ErrorCard>
          <p>After the customer responds back to the sent quotes, it will move to &quote;messages&quote; as well as &quote;pending&quote;</p>
        </ErrorCard>
      </LayoutAdmin>
    </>
  )
}

export default Index