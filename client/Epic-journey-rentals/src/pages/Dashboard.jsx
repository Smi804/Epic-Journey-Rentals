import React from 'react'
import Navbar from '../Comps/Navbar'
import Listings from '../Comps/Listings'
import FAQs from '../Comps/Faqs'
import Newsletter from '../Comps/newsletter'
import Footer from '../Comps/Footer'

function Dashboard() {
  return (
    <>
    <Navbar/>
    <Listings/>
    <FAQs/>
    <Newsletter/>
    <Footer />      
    </>
  )
}

export default Dashboard
