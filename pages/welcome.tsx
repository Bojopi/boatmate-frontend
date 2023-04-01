import React from 'react'
import CarouselComponent from '../components/carousel'
import FooterComponent from '../components/footer'
import MenuBar from '../components/menuBar'
import SectionTitle from '../components/sectionTitle'

const Welcome = () => {
  return (
    <>
        <MenuBar linkMenu='Join Our Pro Network' urlMenu='/pro'  />
        <SectionTitle 
            title1="Welcome back"
            title2="Juan Perez"
            btnLabel='View Categories'
            img="https://i.postimg.cc/mgt5kh39/angelina-herbert-T09mdb-YH8-Ac-unsplash.jpg"
        />
        <div className="w-full p-10 md:pl-28 text-white" style={{'backgroundColor': '#00CBA4'}}>
            <h1 className="text-xl w-full md:text-4xl font-bold flex md:w-2/3 tracking-wide">CATEGORIES</h1>
            <p className="w-full pt-5 md:w-2/3 tracking-wide">At BoatMate we offer services including, but not limited to: technical services,  maintenance & repair services, cleaning services, transportation services, and many more.</p>
        </div>
        <CarouselComponent />
        <FooterComponent />
    </>
  )
}

export default Welcome