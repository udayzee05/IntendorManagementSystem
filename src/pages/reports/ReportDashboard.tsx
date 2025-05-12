import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/ui/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { mockUsers } from '../../data/mockData';

const ReportDashboard: React.FC = () => {
  const { indents, purchaseOrders, vendors } = useData();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Status data for pie chart
  const statusCounts = {
    pending: indents.filter(i => i.status === 'pending').length,
    approved: indents.filter(i => i.status === 'approved').length,
    procurement_approved: indents.filter(i => i.status === 'procurement_approved').length,
    po_created: indents.filter(i => i.status === 'po_created').length,
    rejected: indents.filter(i => i.status === 'rejected').length
  };
  
  const statusData = [
    { name: 'Pending', value: statusCounts.pending, color: '#3B82F6' },
    { name: 'Manager Approved', value: statusCounts.approved, color: '#10B981' },
    { name: 'Procurement Approved', value: statusCounts.procurement_approved, color: '#8B5CF6' },
    { name: 'PO Created', value: statusCounts.po_created, color: '#F59E0B' },
    { name: 'Rejected', value: statusCounts.rejected, color: '#EF4444' }
  ];
  
  // Department data for bar chart
  const departmentCounts: Record<string, number> = {};
  indents.forEach(indent => {
    departmentCounts[indent.department] = (departmentCounts[indent.department] || 0) + 1;
  });
  
  const departmentData = Object.entries(departmentCounts).map(([name, value]) => ({
    name,
    value
  }));
  
  // Priority data for pie chart
  const priorityCounts = {
    low: indents.filter(i => i.priority === 'low').length,
    medium: indents.filter(i => i.priority === 'medium').length,
    high: indents.filter(i => i.priority === 'high').length,
    urgent: indents.filter(i => i.priority === 'urgent').length
  };
  
  const priorityData = [
    { name: 'Low', value: priorityCounts.low, color: '#9CA3AF' },
    { name: 'Medium', value: priorityCounts.medium, color: '#3B82F6' },
    { name: 'High', value: priorityCounts.high, color: '#F59E0B' },
    { name: 'Urgent', value: priorityCounts.urgent, color: '#EF4444' }
  ];
  
  // Top requesters
  const requesterCounts: Record<string, number> = {};
  indents.forEach(indent => {
    requesterCounts[indent.requesterId] = (requesterCounts[indent.requesterId] || 0) + 1;
  });
  
  const topRequesters = Object.entries(requesterCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const user = mockUsers.find(u => u.id === id);
      return {
        name: user ? user.name : 'Unknown User',
        department: user ? user.department : '',
        count
      };
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">View insights and track procurement metrics</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transform transition-transform hover:scale-105">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Total Indents</p>
            <p className="text-3xl font-bold text-gray-900">{indents.length}</p>
          </div>
        </Card>
        
        <Card className="transform transition-transform hover:scale-105">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Approved Rate</p>
            <p className="text-3xl font-bold text-gray-900">
              {indents.length ? Math.round(((statusCounts.approved + statusCounts.procurement_approved + statusCounts.po_created) / indents.length) * 100) : 0}%
            </p>
          </div>
        </Card>
        
        <Card className="transform transition-transform hover:scale-105">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Purchase Orders</p>
            <p className="text-3xl font-bold text-gray-900">{purchaseOrders.length}</p>
          </div>
        </Card>
        
        <Card className="transform transition-transform hover:scale-105">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Active Vendors</p>
            <p className="text-3xl font-bold text-gray-900">{vendors.length}</p>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Indent Status Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} indents`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Indents by Department">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Number of Indents" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Priority Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} indents`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Top Requesters">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Indents Raised
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topRequesters.map((requester, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{requester.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{requester.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{requester.count}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportDashboard;