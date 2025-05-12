import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { Plus, Filter, Search } from 'lucide-react';
import { Indent, Status, Priority } from '../../types';

const IndentList: React.FC = () => {
  const { indents } = useData();
  const { currentUser, hasPermission } = useAuth();
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Determine if we should show all indents or just the user's indents
  const isAdmin = hasPermission('admin');
  const isProcurementOfficer = hasPermission('procurement_officer');
  const isManager = hasPermission('manager');
  
  // Filter indents based on user role and filters
  const filteredIndents = indents.filter(indent => {
    // For regular employees, only show their own indents
    if (!isAdmin && !isProcurementOfficer && !isManager) {
      if (indent.requesterId !== currentUser?.id) return false;
    }
    
    // Apply search term filter (on title)
    if (searchTerm && !indent.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== 'all' && indent.status !== statusFilter) {
      return false;
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all' && indent.priority !== priorityFilter) {
      return false;
    }
    
    return true;
  });
  
  // Sort indents by date (newest first)
  const sortedIndents = [...filteredIndents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Indents</h1>
          <p className="text-gray-600">
            {isAdmin || isProcurementOfficer || isManager
              ? 'Manage all indent requests'
              : 'Manage your indent requests'}
          </p>
        </div>
        
        {hasPermission('employee') && (
          <Link to="/indents/new">
            <Button
              variant="primary"
              leftIcon={<Plus size={18} />}
              className="mt-4 sm:mt-0"
            >
              New Indent
            </Button>
          </Link>
        )}
      </div>
      
      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search indents..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<Filter size={18} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="procurement_approved">Procurement Approved</option>
                <option value="po_created">PO Created</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        )}
      </Card>
      
      {/* Indents Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedIndents.length > 0 ? (
                sortedIndents.map(indent => (
                  <tr key={indent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{indent.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{indent.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{indent.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={indent.priority} type="priority" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={indent.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/indents/${indent.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No indents found. {hasPermission('employee') && (
                      <Link to="/indents/new" className="text-indigo-600 hover:text-indigo-900">
                        Create a new indent
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default IndentList;