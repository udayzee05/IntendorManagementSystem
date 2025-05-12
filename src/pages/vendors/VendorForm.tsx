import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';

const VendorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addVendor, updateVendor, getVendorById } = useData();
  const isEditing = !!id;
  
  // Form state
  const [formValues, setFormValues] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    itemCategories: [''],
    rating: undefined as number | undefined
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Load vendor data if editing
  useEffect(() => {
    if (isEditing && id) {
      const vendor = getVendorById(id);
      if (vendor) {
        setFormValues({
          name: vendor.name,
          contactPerson: vendor.contactPerson,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address || '',
          itemCategories: vendor.itemCategories.length ? vendor.itemCategories : [''],
          rating: vendor.rating
        });
      }
    }
  }, [id, isEditing, getVendorById]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation
    if (!formValues.name.trim()) {
      newErrors.name = 'Vendor name is required';
    }
    
    if (!formValues.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formValues.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formValues.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    // Validate categories
    const validCategories = formValues.itemCategories.filter(cat => cat.trim() !== '');
    if (validCategories.length === 0) {
      newErrors.itemCategories = 'At least one category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (index: number, value: string) => {
    setFormValues(prev => {
      const newCategories = [...prev.itemCategories];
      newCategories[index] = value;
      return { ...prev, itemCategories: newCategories };
    });
  };
  
  const addCategory = () => {
    setFormValues(prev => ({
      ...prev,
      itemCategories: [...prev.itemCategories, '']
    }));
  };
  
  const removeCategory = (index: number) => {
    if (formValues.itemCategories.length > 1) {
      setFormValues(prev => ({
        ...prev,
        itemCategories: prev.itemCategories.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleRatingChange = (rating: number) => {
    setFormValues(prev => ({ ...prev, rating }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Filter out empty categories
      const cleanedFormValues = {
        ...formValues,
        itemCategories: formValues.itemCategories.filter(cat => cat.trim() !== '')
      };
      
      if (isEditing && id) {
        updateVendor(id, cleanedFormValues);
      } else {
        addVendor(cleanedFormValues);
      }
      
      navigate('/vendors');
    } catch (error) {
      console.error('Error saving vendor:', error);
      setErrors({ form: 'Failed to save vendor. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Vendor' : 'Add New Vendor'}
          </h1>
        </div>
      </div>
      
      {errors.form && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.form}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Card title="Vendor Information">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Vendor Name*
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.name ? 'border-red-300' : ''
                }`}
                value={formValues.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                Contact Person*
              </label>
              <input
                type="text"
                name="contactPerson"
                id="contactPerson"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.contactPerson ? 'border-red-300' : ''
                }`}
                value={formValues.contactPerson}
                onChange={handleChange}
              />
              {errors.contactPerson && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : ''
                }`}
                value={formValues.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone*
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.phone ? 'border-red-300' : ''
                }`}
                value={formValues.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                id="address"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formValues.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>
        
        <Card 
          className="mt-6"
          title="Item Categories"
          subtitle="What types of items does this vendor provide?"
          footer={
            <Button
              type="button"
              variant="secondary"
              onClick={addCategory}
              leftIcon={<Plus size={18} />}
            >
              Add Category
            </Button>
          }
        >
          {errors.itemCategories && (
            <p className="mb-4 text-sm text-red-600">{errors.itemCategories}</p>
          )}
          
          {formValues.itemCategories.map((category, index) => (
            <div key={index} className="flex items-center mb-3">
              <input
                type="text"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={category}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                placeholder="e.g., Office Supplies, Electronics, Furniture"
              />
              {formValues.itemCategories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="ml-2 p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </Card>
        
        <Card className="mt-6" title="Vendor Rating">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`p-1 rounded-full ${
                  (formValues.rating || 0) >= star
                    ? 'text-amber-500'
                    : 'text-gray-300'
                }`}
              >
                <Star size={24} className="fill-current" />
              </button>
            ))}
            {formValues.rating && (
              <span className="ml-2 text-sm text-gray-600">
                ({formValues.rating} out of 5)
              </span>
            )}
          </div>
        </Card>
        
        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/vendors')}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Save size={18} />}
          >
            {isEditing ? 'Update Vendor' : 'Save Vendor'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VendorForm;