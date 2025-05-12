import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, Search, Star, StarHalf } from 'lucide-react';

const VendorList: React.FC = () => {
  const { vendors } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      vendor.name.toLowerCase().includes(searchLower) ||
      vendor.contactPerson.toLowerCase().includes(searchLower) ||
      vendor.email.toLowerCase().includes(searchLower) ||
      vendor.itemCategories.some(cat => cat.toLowerCase().includes(searchLower))
    );
  });

  // Render star rating
  const renderRating = (rating: number | undefined) => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={16} className="text-amber-500 fill-amber-500" />
        ))}
        {hasHalfStar && <StarHalf size={16} className="text-amber-500 fill-amber-500" />}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600">Manage suppliers and service providers</p>
        </div>
        
        <Link to="/vendors/new">
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            className="mt-4 sm:mt-0"
          >
            Add Vendor
          </Button>
        </Link>
      </div>
      
      {/* Search */}
      <Card>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search vendors by name, contact person, or category..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>
      
      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map(vendor => (
          <Card key={vendor.id} className="transition-transform hover:scale-105">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium text-gray-900">{vendor.name}</h3>
              {vendor.rating && renderRating(vendor.rating)}
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Contact:</span> {vendor.contactPerson}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {vendor.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span> {vendor.phone}
              </p>
              
              {vendor.address && (
                <p className="text-sm">
                  <span className="font-medium">Address:</span> {vendor.address}
                </p>
              )}
              
              <div className="pt-2">
                <p className="text-sm font-medium">Categories:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {vendor.itemCategories.map((category, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Link 
                to={`/vendors/${vendor.id}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
              >
                Edit Details
              </Link>
            </div>
          </Card>
        ))}
        
        {filteredVendors.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No vendors found matching your search criteria.</p>
            <Link to="/vendors/new" className="mt-4 inline-block text-indigo-600 hover:text-indigo-900">
              Add a new vendor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorList;