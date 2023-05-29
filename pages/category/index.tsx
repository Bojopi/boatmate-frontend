import FooterComponent from '@/components/footer'
import MenuBar from '@/components/menuBar'
import React from 'react'

const Index = () => {
  return (
    <>
        <MenuBar linkMenu='Join Our Pro Network' urlMenu='/pro'/>
        <div>Index</div>
        <FooterComponent />
    </>
  )
}

export default Index