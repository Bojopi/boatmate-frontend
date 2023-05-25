import ErrorCard from '@/components/errorCard'
import LayoutAdmin from '@/components/layoutAdmin'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Index = () => {

  const [type, setType] = useState<string | string[]>('')

  const router = useRouter();

  useEffect(() => {
    if(router.query.type) {
      console.log(router.query.type)
      setType(router.query.type);
    }
  }, [router.query.type])

  return (
    <>
      <LayoutAdmin>
        {
          type == 'confirmed' ?
            <ErrorCard>
              <p>After the customer clicks hire pro, the job will move to &quote;job confirmed&quote;</p>
            </ErrorCard>
          : type == 'done' ?
            <ErrorCard>
              <p>After the job is completed, the marine service provider can click “job completed” and it will move to “job done”</p>
            </ErrorCard>
          : type == 'hired' ?
            <ErrorCard>
              <p>If the customer decides not to hire the marine service provider, there will be a button for them to choose “do not hire” and that message will automatically go into the “Not Hired” section.</p>
            </ErrorCard>
          : null
        }
      </LayoutAdmin>
    </>
  )
}

export default Index