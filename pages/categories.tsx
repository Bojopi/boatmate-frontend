
import React, { useState, useEffect } from 'react'
import FooterComponent from '@/components/footer'
import Layout from '@/components/layout'
import MenuBar from '@/components/menuBar'
import { Categories } from '@/hooks/categories'
import { Category } from '@/interfaces/interfaces'
import Link from 'next/link'

const CategoriesComponent = () => {
    const {getAllCategories} = Categories();

    const [categories, setCategories] = useState<Category[]>();

    useEffect(() => {
        getCategories();
    });

    const getCategories = async () => {
        const res = await getAllCategories();
        if(res.status == 200) {
            setCategories(res.data.categories);
        }
    }

  return (
    <Layout>
        <MenuBar linkMenu='Join Our Pro Network' urlMenu='/pro'/>
        <div className='w-full flex flex-col items-center justify-center pb-10 pt-36 lg:pt-44'>
            <p className='text-xl font-bold'>Find the perfect pro for your project.</p>
            <p className='text-lg'>Select a category or city below to get started.</p>
        </div>

        <div className='w-full py-10 px-40 bg-neutral-100'>
            <p className='font-bold'>Top categories</p>
            <ul className='w-full container-group-categories'>
                {
                    categories ? categories.map((item: Category, i: number) => (
                        <li key={i} className='leading-loose text-[#0d8fc7] font-medium w-auto'>
                            <Link href={'/'} className='hover:underline hover:underline-offset-2'>
                                {item.category_name}
                            </Link>
                        </li>
                    ))
                    : 'No categories'
                }
            </ul>
        </div>
        <FooterComponent />
    </Layout>
  )
}

export default CategoriesComponent