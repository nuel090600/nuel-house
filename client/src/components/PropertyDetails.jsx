import React, { useState, useEffect } from 'react';
import { FaBath, FaBed, FaHeart, FaShareAlt } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const PropertyCard = ({ property }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
    <div className="relative">
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      {property.featured && (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          Featured
        </span>
      )}
      <span className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
        property.for === "Rent" ? "bg-blue-500" : "bg-green-600"
      }`}>
        {property.for}
      </span>
    </div>
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{property.title}</h2>
        <div className="text-gray-500 text-sm flex items-center">
          <MdLocationOn className="mr-1" />
          {property.location}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 mb-4">
        <div className="flex items-center gap-1">
          <FaBed className="text-gray-400" /> {property.bedrooms}
        </div>
        <div className="flex items-center gap-1">
          <FaBath className="text-gray-400" /> {property.bathrooms}
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="font-bold text-gray-900 text-lg">
          {property.price}
        </div>
        <div className="flex justify-between mt-3 text-gray-500">
          <button className="hover:text-red-500 transition-colors">
            <FaHeart />
          </button>
          <button className="hover:text-blue-500 transition-colors">
            <FaShareAlt />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function PropertiesGrid() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ REAL API CALL - Fetch properties from your backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/properties');
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setProperties(data.data.properties);
        } else {
          throw new Error(data.message || 'Failed to fetch properties');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-lg">Loading properties...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 text-lg">Error: {error}</div>
          <div className="text-gray-600 mt-2">
            Make sure your backend server is running on http://localhost:5000
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-sm text-gray-600 mb-2 md:mb-0">
            Showing 1–{properties.length} of {properties.length} results
          </div>
          <div className="text-sm text-gray-600">
            Sort by: 
            <select className="ml-2 border rounded px-2 py-1 bg-white">
              <option>Default</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>

        {/* Show message if no properties */}
        {properties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No properties found</div>
            <div className="text-gray-400 mt-2">
              Add some properties to your database to see them here
            </div>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <nav className="flex items-center gap-1">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 border rounded text-sm ${
                  page === 2
                    ? 'bg-[#3D9970] text-white border-[#3D9970]'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}