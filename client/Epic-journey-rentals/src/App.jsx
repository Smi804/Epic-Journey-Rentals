
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import ItemsDetails from './pages/ItemsDetails'
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import OwnerListings from './pages/OwnerListings';
import CreateListing from './pages/CreateListing';
import OwnerBookings from './pages/OwnerBookings';
import EditListing from './pages/EditListing';
import ChatPage from './pages/ChatPage';
import Inbox from './pages/Inbox';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/listing/:id" element={<ItemsDetails />} />
      <Route path="/renter/bookings" element={<Bookings />} />
      <Route path="/owner/listings" element={<OwnerListings />} />
      <Route path='/owner/create' element={<CreateListing/>}/>
      <Route path='/owner/bookings' element={<OwnerBookings/>}/>
      <Route path='/owner/edit/:id' element={<EditListing/>}/>
      <Route path="/chat/:ownerId" element={<ChatPage />} />
      <Route path="/inbox" element={<Inbox />} />

      
    </Routes>

  );
}

export default App
