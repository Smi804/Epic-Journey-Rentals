
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Items from './pages/Items'
import ItemsDetails from './pages/ItemsDetails'
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import OwnerListings from './pages/OwnerListings';
import CreateListing from './pages/CreateListing';
import OwnerBookings from './pages/OwnerBookings';
import EditListing from './pages/EditListing';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:id" element={<ItemsDetails />} />
      <Route path="/renter/bookings" element={<Bookings />} />
      <Route path="/owner/listings" element={<OwnerListings />} />
      <Route path='/owner/create' element={<CreateListing/>}/>
      <Route path='/owner/bookings' element={<OwnerBookings/>}/>
      <Route path='/owner/edit/:id' element={<EditListing/>}/>
      
    </Routes>

  );
}

export default App
