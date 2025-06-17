
import { BrowserRouter as Router,Routes,Route }   from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Rent from './pages/Rent';
import Lease from './pages/Lease';
import Auth from './pages/Auth';
import HowItWorks from './pages/HowItWorks';
import Register from './pages/Register';
import Items from './pages/Items'
import Listings from './pages/Listings';
import ItemsDetails from './pages/ItemsDetails'
import Sidebar from './Comps/Sidebar'
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FaBars } from 'react-icons/fa';



function App() {
const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
    
      {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}
      <div>
         <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/lease" element={<Lease />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/register" element={<Register />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemsDetails />} />
        </Routes>
      </div>
    </>    
  );
}

export default App
