import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Priority, IndentFormValues } from '../../types';
import { Plus, Minus, Save, ArrowLeft } from 'lucide-react';

const IndentForm: React.FC = () => {
  const { addIndent } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formValues, setFormValues] = useState<IndentFormValues>({
    title: '',
    department: currentUser?.department || '',
    priority: 'medium',
    description: '',
    items: [
      {
        name: '',
        description: '',
        quantity: 1,
        unit: 'pieces',
        estimatedCost: 0,
        justification: ''
      }
    ]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate basic fields
    if (!formValues.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formValues.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    // Validate each item
    formValues.items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`items[${index}].name`] = 'Item name is required';
      }
      
      if (item.quantity <= 0) {
        newErrors[`items[${index}].quantity`] = 'Quantity must be greater than 0';
      }
      
      if (!item.unit.trim()) {
        newErrors[`items[${index}].unit`] = 'Unit is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItemChange = (index: number, field: string, value: any) => {
    setFormValues(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };
  
  const addItem = () => {
    setFormValues(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: '',
          description: '',
          quantity: 1,
          unit: 'pieces',
          estimatedCost: 0,
          justification: ''
        }
      ]
    }));
  };
  
  const removeItem = (index: number) => {
    if (formValues.items.length > 1) {
      setFormValues(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    if (currentUser) {
      try {
        const indentId = addIndent({
          requesterId: currentUser.id,
          department: formValues.department,
          priority: formValues.priority as Priority,
          title: formValues.title,
          description: formValues.description,
          items: formValues.items
        });
        
        navigate(`/indents/${indentId}`);
      } catch (error) {
        console.error('Error creating indent:', error);
        setErrors({ form: 'Failed to create indent. Please try again.' });
        setIsLoading(false);
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Indent</h1>
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
        <div className="space-y-6">
          {/* Basic Indent Details */}
          <Card title="Basic Information">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title*
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.title ? 'border-red-300' : ''
                  }`}
                  value={formValues.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department*
                </label>
                <input
                  type="text"
                  name="department"
                  id="department"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.department ? 'border-red-300' : ''
                  }`}
                  value={formValues.department}
                  onChange={handleChange}
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority*
                </label>
                <select
                  name="priority"
                  id="priority"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formValues.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formValues.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>
          
          {/* Indent Items */}
          <Card 
            title="Indent Items" 
            subtitle="Add all the items you want to request"
            footer={
              <Button
                type="button"
                variant="secondary"
                onClick={addItem}
                leftIcon={<Plus size={18} />}
              >
                Add Item
              </Button>
            }
          >
            {formValues.items.map((item, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md relative">
                {formValues.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    <Minus size={18} />
                  </button>
                )}
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Item Name*
                    </label>
                    <input
                      type="text"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors[`items[${index}].name`] ? 'border-red-300' : ''
                      }`}
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    />
                    {errors[`items[${index}].name`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`items[${index}].name`]}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity*
                      </label>
                      <input
                        type="number"
                        min="1"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors[`items[${index}].quantity`] ? 'border-red-300' : ''
                        }`}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      />
                      {errors[`items[${index}].quantity`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`items[${index}].quantity`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Unit*
                      </label>
                      <input
                        type="text"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                          errors[`items[${index}].unit`] ? 'border-red-300' : ''
                        }`}
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                      />
                      {errors[`items[${index}].unit`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`items[${index}].unit`]}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estimated Cost
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={item.estimatedCost}
                      onChange={(e) => handleItemChange(index, 'estimatedCost', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Justification
                    </label>
                    <textarea
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={item.justification}
                      onChange={(e) => handleItemChange(index, 'justification', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Card>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/indents')}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              leftIcon={<Save size={18} />}
            >
              Submit Indent
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IndentForm;