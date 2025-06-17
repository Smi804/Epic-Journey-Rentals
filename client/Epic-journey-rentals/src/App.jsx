
import { BrowserRouter as Router,Routes,Route }   from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Rent from './pages/Rent';
import Lease from './pages/Lease';
import Auth from './pages/Auth';
import Register from './pages/Register';
import Listings from './pages/Listings';
import ItemsDetails from './pages/ItemsDetails'
import { useState } from 'react';



function App() {
const [isSidebarOpen, setSidebarOpen] = useState(false);

 

  return (
    <>
      {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}
      <div> {/* Push page content below fixed topbar */}
         <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/lease" element={<Lease />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items/:id" element={<ItemsDetails />} />
        </Routes>
      </div>
    </>    
  );
}

export default App
