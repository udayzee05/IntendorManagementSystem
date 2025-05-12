import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { 
  Plus, 
  ShoppingCart, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  ClipboardList
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { indents, purchaseOrders } = useData();
  const { currentUser, hasPermission } = useAuth();

  // Calculate dashboard stats
  const pendingIndents = indents.filter(indent => indent.status === 'pending').length;
  const approvedIndents = indents.filter(indent => indent.status === 'approved' || indent.status === 'procurement_approved').length;
  const rejectedIndents = indents.filter(indent => indent.status === 'rejected').length;
  const totalPurchaseOrders = purchaseOrders.length;

  // Stats specifically for current user
  const myIndents = indents.filter(indent => indent.requesterId === currentUser?.id);
  const myPendingIndents = myIndents.filter(indent => indent.status === 'pending').length;
  const myApprovedIndents = myIndents.filter(indent => ['approved', 'procurement_approved', 'po_created'].includes(indent.status)).length;
  const myRejectedIndents = myIndents.filter(indent => indent.status === 'rejected').length;

  // Chart data
  const indentStatusData = [
    { name: 'Pending', value: pendingIndents, color: '#3B82F6' },
    { name: 'Approved', value: approvedIndents, color: '#10B981' },
    { name: 'Rejected', value: rejectedIndents, color: '#EF4444' },
    { name: 'PO Created', value: totalPurchaseOrders, color: '#F59E0B' }
  ];

  // Recent indents
  const recentIndents = [...indents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="transform transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Clock size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Indents</p>
              <h3 className="text-xl font-bold text-gray-900">{pendingIndents}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="transform transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved Indents</p>
              <h3 className="text-xl font-bold text-gray-900">{approvedIndents}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="transform transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <XCircle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rejected Indents</p>
              <h3 className="text-xl font-bold text-gray-900">{rejectedIndents}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="transform transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <ShoppingCart size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Purchase Orders</p>
              <h3 className="text-xl font-bold text-gray-900">{totalPurchaseOrders}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Indent Status Chart */}
        <Card title="Indent Status Overview">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={indentStatusData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                  {indentStatusData.map((entry, index) => (
                    <Bar key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* My Indents Summary */}
        <Card title="My Indents">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-blue-700">Pending</p>
                <p className="text-2xl font-bold text-blue-900">{myPendingIndents}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-green-700">Approved</p>
                <p className="text-2xl font-bold text-green-900">{myApprovedIndents}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-red-700">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{myRejectedIndents}</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Link to="/indents">
                <Button 
                  variant="primary"
                  leftIcon={<ClipboardList size={18} />}
                >
                  View All My Indents
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Indents */}
      <Card title="Recent Indents">
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
              {recentIndents.map(indent => (
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;