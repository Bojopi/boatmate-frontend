import ErrorCard from '@/components/errorCard'
import LayoutAdmin from '@/components/layoutAdmin'
import React from 'react'

const Index = () => {
  return (
    <>
      <LayoutAdmin>
        <ErrorCard>
          <p>After you confirm an opportunity, those direct leads will show up in sent quotes and messages.</p>
        </ErrorCard>
      </LayoutAdmin>
    </>
  )
}

export default Index