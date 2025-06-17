import React, { useEffect, useState } from 'react';
import Navbar from '../Comps/Navbar';
import api from '../api/axios';

const Listings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get('/listings');
        setListings(response.data);
      } catch (error) {
        console.error('Failed to fetch listings:', error.response?.data || error.message);
      }
    };

    fetchListings();
  }, []);

  return (<>
    <Navbar/>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Listings</h2>
      {listings.map(listing => (
        <div key={listing._id} className="border rounded p-2 mb-2">
          <h3 className="text-lg font-semibold">{listing.title}</h3>
          <p>{listing.description}</p>
          <p className="text-sm text-gray-600">{listing.category} - ${listing.price}</p>
        </div>
      ))}
    </div>  </>
  );

};

export default Listings;
