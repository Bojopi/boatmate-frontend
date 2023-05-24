import React from 'react'
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import LayoutAdmin from '@/components/layoutAdmin';

const Index = () => {
  return (
    <>
      <LayoutAdmin>
        <div className='w-full min-h-[300px] flex flex-col items-center justify-start'>
          <span className="w-full p-input-icon-left">
              <i className="pi pi-search" />
              <InputText placeholder="Search" className='w-full' />
          </span>
          <div className='w-full max-h-[500px] overflow-y-auto'>
            <div className='flex flex-row justify-between items-start py-2 border-b'>
              <div className='flex flex-row gap-2'>
                <FontAwesomeIcon icon={faReply} className='w-[10px] h-[10px] mt-2' />
                <div className=''>
                  <p className='font-medium'>Melissa W.</p>
                  <p className='text-xs text-gray-400'>Drywall Repair and Texturing &#9679; Tampa</p>
                  <p>any photos?</p>
                </div>
              </div>
              <p className='text-xs text-gray-400 font-medium'>
                1h
              </p>
            </div>
            <div className='w-full flex flex-row justify-between items-start py-2 border-b'>
              <div className='flex flex-row gap-2'>
                <FontAwesomeIcon icon={faReply} className='w-[10px] h-[10px] mt-2' />
                <div className=''>
                  <p className='font-medium'>Abigail A.</p>
                  <p className='text-xs text-gray-400'>Drywall Repair and Texturing &#9679; Tampa</p>
                  <p>any photos?</p>
                </div>
              </div>
              <p className='text-xs text-gray-400 font-medium'>
                1h
              </p>
            </div>
            <div className='w-full flex flex-row justify-between items-start py-2 border-b'>
              <div className='flex flex-row gap-2'>
                <FontAwesomeIcon icon={faReply} className='w-[10px] h-[10px] mt-2' />
                <div className=''>
                  <p className='font-medium'>Alexander L.</p>
                  <p className='text-xs text-gray-400'>Drywall Repair and Texturing &#9679; Tampa</p>
                  <p>any photos?</p>
                </div>
              </div>
              <p className='text-xs text-gray-400 font-medium'>
                1h
              </p>
            </div>
            <div className='w-full flex flex-row justify-between items-start py-2 border-b'>
              <div className='flex flex-row gap-2'>
                <FontAwesomeIcon icon={faReply} className='w-[10px] h-[10px] mt-2' />
                <div className=''>
                  <p className='font-medium'>Emma C.</p>
                  <p className='text-xs text-gray-400'>Drywall Repair and Texturing &#9679; Tampa</p>
                  <p>any photos?</p>
                </div>
              </div>
              <p className='text-xs text-gray-400 font-medium'>
                1h
              </p>
            </div>
            <div className='w-full flex flex-row justify-between items-start py-2 border-b'>
              <div className='flex flex-row gap-2'>
                <FontAwesomeIcon icon={faReply} className='w-[10px] h-[10px] mt-2' />
                <div className=''>
                  <p className='font-medium'>Carter A.</p>
                  <p className='text-xs text-gray-400'>Drywall Repair and Texturing &#9679; Tampa</p>
                  <p>any photos?</p>
                </div>
              </div>
              <p className='text-xs text-gray-400 font-medium'>
                1h
              </p>
            </div>
            <div className='w-full flex flex-row justify-between items-start py-2 border-b'>
              <div className='flex flex-row gap-2'>
                <FontAwesomeIcon icon={faReply} className='w-[10px] h-[10px] mt-2' />
                <div className=''>
                  <p className='font-medium'>Xavier J.</p>
                  <p className='text-xs text-gray-400'>Drywall Repair and Texturing &#9679; Tampa</p>
                  <p>any photos?</p>
                </div>
              </div>
              <p className='text-xs text-gray-400 font-medium'>
                1h
              </p>
            </div>
            <div className='w-full flex flex-row justify-between items-start py-2 border-b'>
              <div className='flex flex-row gap-2'>
                <FontAwesomeIcon icon={faReply} className='w-[10px] h-[10px] mt-2' />
                <div className=''>
                  <p className='font-medium'>Noelia P.</p>
                  <p className='text-xs text-gray-400'>Drywall Repair and Texturing &#9679; Tampa</p>
                  <p>any photos?</p>
                </div>
              </div>
              <p className='text-xs text-gray-400 font-medium'>
                1h
              </p>
            </div>
          </div>
        </div>
      </LayoutAdmin>
    </>
  )
}

export default Index