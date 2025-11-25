// src/components/PropertiesGrid.jsx
import React, { useState, useEffect } from 'react';
import { FaBath, FaBed, FaHeart, FaShareAlt, FaTimes, FaHome } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
            <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover"
            />
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Featured
            </span>
            <span className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
                property.price < 10000000 ? "bg-blue-500" : "bg-green-600"
            }`}>
                {property.price < 10000000 ? "Rent" : "Sale"}
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
                    ₦ {property.price?.toLocaleString()}
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
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get search filters from URL
    const locationFilter = searchParams.get('location') || '';
    const typeFilter = searchParams.get('type') || '';
    const bedroomsFilter = searchParams.get('bedrooms') || '';

    // Get API URL - works on both localhost and Vercel
    const getAPIUrl = () => {
        // If we're in development or on localhost, use local backend
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000';
        }
        // Otherwise use production backend
        return 'https://nuel-house.onrender.com';
    };

    // ✅ REAL API CALL - Fetch properties from your backend
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError('');
                const API_URL = getAPIUrl();
                console.log('🌐 Fetching properties from:', API_URL);

                const response = await fetch(`${API_URL}/api/properties`);
                
                console.log('📡 Response status:', response.status);
                
                if (!response.ok) {
                    // Handle specific HTTP errors
                    if (response.status === 404) {
                        throw new Error('Properties API endpoint not found');
                    } else if (response.status === 500) {
                        throw new Error('Server error - please try again later');
                    } else {
                        throw new Error(`Server returned ${response.status} error`);
                    }
                }

                const data = await response.json();
                console.log('✅ API Response:', data);

                // Handle different response formats
                if (data.status === 'success') {
                    setProperties(data.data?.properties || []);
                    applyFilters(data.data?.properties || []);
                } else if (Array.isArray(data)) {
                    // If response is directly an array
                    setProperties(data);
                    applyFilters(data);
                } else if (data.properties) {
                    // If response has properties field
                    setProperties(data.properties);
                    applyFilters(data.properties);
                } else {
                    throw new Error('Unexpected API response format');
                }
            } catch (err) {
                console.error('❌ Error fetching properties:', err);
                // ✅ REMOVED THE LOCALHOST ERROR MESSAGE
                setError(`Unable to load properties: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Apply filters when search params change
    useEffect(() => {
        if (properties.length > 0) {
            applyFilters(properties);
        }
    }, [locationFilter, typeFilter, bedroomsFilter, properties]);

    const applyFilters = (propertiesList) => {
        let filtered = propertiesList;

        if (locationFilter) {
            filtered = filtered.filter(property =>
                property.location?.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        if (typeFilter) {
            filtered = filtered.filter(property =>
                property.type?.toLowerCase().includes(typeFilter.toLowerCase())
            );
        }

        if (bedroomsFilter) {
            filtered = filtered.filter(property =>
                property.bedrooms >= parseInt(bedroomsFilter)
            );
        }

        setFilteredProperties(filtered);
    };

    const clearFilters = () => {
        navigate('/properties');
    };

    const goBackToHome = () => {
        navigate('/');
    };

    const retryFetch = () => {
        setError('');
        setLoading(true);
        // Re-fetch properties
        const fetchProperties = async () => {
            try {
                const API_URL = getAPIUrl();
                const response = await fetch(`${API_URL}/api/properties`);
                
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status} error`);
                }

                const data = await response.json();
                
                if (data.status === 'success') {
                    setProperties(data.data?.properties || []);
                    applyFilters(data.data?.properties || []);
                } else if (Array.isArray(data)) {
                    setProperties(data);
                    applyFilters(data);
                } else if (data.properties) {
                    setProperties(data.properties);
                    applyFilters(data.properties);
                }
            } catch (err) {
                setError(`Unable to load properties: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProperties();
    };

    const hasActiveFilters = locationFilter || typeFilter || bedroomsFilter;

    if (loading) {
        return (
            <section className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-lg">Loading properties from database...</div>
                    <div className="text-sm text-gray-500 mt-2">Fetching from: {getAPIUrl()}</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-red-500 text-lg mb-4">Unable to Load Properties</div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <div className="flex gap-4 justify-center mt-6">
                        <button
                            onClick={retryFetch}
                            className="bg-[#3D9970] text-white px-6 py-2 rounded hover:bg-green-700"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={goBackToHome}
                            className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                        >
                            <FaHome /> Back to Home
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="px-4 md:px-8 lg:px-16 py-10 bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto">

                {/* Search Results Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="text-sm text-gray-600 mb-2 md:mb-0">
                        {hasActiveFilters ? (
                            <div className="flex items-center gap-4">
                                <span>Showing {filteredProperties.length} of {properties.length} results</span>
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                                >
                                    <FaTimes /> Clear Filters
                                </button>
                            </div>
                        ) : (
                            <span>Showing all {properties.length} properties</span>
                        )}
                    </div>

                    {/* Back to Home Button */}
                    <button
                        onClick={goBackToHome}
                        className="flex items-center gap-2 bg-[#3D9970] text-white px-4 py-2 rounded hover:bg-green-700 transition-colors mb-4 md:mb-0"
                    >
                        <FaHome /> Back to Home
                    </button>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {locationFilter && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                Location: {locationFilter}
                            </span>
                        )}
                        {typeFilter && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                Type: {typeFilter}
                            </span>
                        )}
                        {bedroomsFilter && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                Bedrooms: {bedroomsFilter}+
                            </span>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <PropertyCard key={property._id || property.id} property={property} />
                    ))}
                </div>

                {/* Show message if no properties after filtering */}
                {filteredProperties.length === 0 && hasActiveFilters && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No properties found matching your search criteria</div>
                        <div className="flex gap-4 justify-center mt-4">
                            <button
                                onClick={clearFilters}
                                className="bg-[#3D9970] text-white px-6 py-2 rounded hover:bg-green-700"
                            >
                                Show All Properties
                            </button>
                            <button
                                onClick={goBackToHome}
                                className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                            >
                                <FaHome /> Back to Home
                            </button>
                        </div>
                    </div>
                )}

                {filteredProperties.length === 0 && !hasActiveFilters && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No properties found</div>
                        <button
                            onClick={goBackToHome}
                            className="flex items-center gap-2 bg-[#3D9970] text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
                        >
                            <FaHome /> Back to Home
                        </button>
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