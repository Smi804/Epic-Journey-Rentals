import React from 'react'
import Navbar from '../Comps/Navbar'
import Listings from '../Comps/Listings'
import Newsletter from '../Comps/newsletter'
import Footer from '../Comps/Footer'

function Dashboard() {
  return (
    <>
      <Navbar />
      <Listings />
      <Newsletter />
      <Footer />
    </>
  )
}

export default Dashboard
