
import React from 'react'
import { PuffLoader } from 'react-spinners'

export type SpinnerProps = {
    loading: boolean
}

const Spinner: React.FC<SpinnerProps> = ({ loading=true }) => {

  return (
    <div className={`${loading ? 'w-full h-screen fixed top-0 left-0 flex justify-center z-20 items-center bg-gray-200 bg-opacity-50' : 'hidden'}`}>
        <PuffLoader loading={loading} color="#36d7b7" />
    </div>
  )
}

export default Spinner;