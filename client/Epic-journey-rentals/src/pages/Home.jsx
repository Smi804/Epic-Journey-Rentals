import React from 'react'
import Header from  '../Comps/Header.jsx'
import Footer from '../Comps/Footer.jsx'
import Items from './Items.jsx'
import Newsletter from '../Comps/newsletter.jsx'

function Home() {
  return (
    <div>
    <Header /> 

     <Items/>
     <Newsletter/>
     <Footer/>
    </div>
  )
}

export default Home
