import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { mockUsers } from '../../data/mockData';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  ShoppingCart, 
  Printer, 
  MessageSquare
} from 'lucide-react';
import { ApprovalStatus } from '../../types';

const IndentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIndentById, updateIndent, addApproval, vendors, createPurchaseOrder } = useData();
  const { currentUser, hasPermission } = useAuth();
  
  // Modal states
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  
  // Form states
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('approved');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState('');
  
  if (!id) {
    return <div>Invalid indent ID</div>;
  }
  
  const indent = getIndentById(id);
  
  if (!indent) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900">Indent not found</h2>
        <p className="mt-2 text-gray-600">The indent you're looking for doesn't exist or has been removed.</p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate('/indents')}
        >
          Back to Indents
        </Button>
      </div>
    );
  }
  
  // Find requester details
  const requester = mockUsers.find(user => user.id === indent.requesterId);
  
  // Find approvers details
  const getApproverName = (approverId: string) => {
    const approver = mockUsers.find(user => user.id === approverId);
    return approver ? approver.name : 'Unknown User';
  };
  
  // Calculate total estimated cost
  const totalCost = indent.items.reduce(
    (sum, item) => sum + (item.estimatedCost || 0) * item.quantity,
    0
  );
  
  // Handle approval submission
  const handleApproval = () => {
    if (!currentUser) return;
    
    addApproval({
      indentId: indent.id,
      approverId: currentUser.id,
      status: approvalStatus,
      remarks: approvalRemarks
    });
    
    setShowApprovalModal(false);
    setApprovalRemarks('');
  };
  
  // Handle PO creation
  const handleCreatePO = () => {
    if (!selectedVendorId) return;
    
    createPurchaseOrder(indent.id, selectedVendorId);
    setShowPOModal(false);
  };
  
  // Determine if the current user can approve this indent
  const canApprove = () => {
    if (!currentUser) return false;
    
    // Check if user is a manager or procurement officer
    const isManager = hasPermission('manager');
    const isProcurementOfficer = hasPermission('procurement_officer');
    
    if (!isManager && !isProcurementOfficer) return false;
    
    // Check current status
    if (isManager && indent.status === 'pending') return true;
    if (isProcurementOfficer && indent.status === 'approved') return true;
    
    return false;
  };
  
  // Determine if PO can be created
  const canCreatePO = () => {
    return hasPermission('procurement_officer') && indent.status === 'procurement_approved';
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
          <h1 className="text-2xl font-bold text-gray-900">Indent Details</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            leftIcon={<Printer size={18} />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          
          {canApprove() && (
            <Button
              variant="primary"
              leftIcon={<MessageSquare size={18} />}
              onClick={() => setShowApprovalModal(true)}
            >
              Add Approval
            </Button>
          )}
          
          {canCreatePO() && (
            <Button
              variant="success"
              leftIcon={<ShoppingCart size={18} />}
              onClick={() => setShowPOModal(true)}
            >
              Create PO
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Indent Basic Info */}
          <Card>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{indent.title}</h2>
                <p className="text-gray-600 mt-1">
                  {indent.description || 'No description provided'}
                </p>
              </div>
              <StatusBadge status={indent.status} />
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{indent.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Requested</p>
                <p className="font-medium">{indent.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <StatusBadge status={indent.priority} type="priority" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Estimated Cost</p>
                <p className="font-medium">${totalCost.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          
          {/* Indent Items */}
          <Card title="Requested Items">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Est. Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {indent.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                        {item.justification && (
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">Justification:</span> {item.justification}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.estimatedCost?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${((item.estimatedCost || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Total Estimated Cost:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      ${totalCost.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Requester Info */}
          <Card title="Requester">
            {requester && (
              <div className="flex items-center space-x-4">
                <img 
                  src={requester.avatar || 'https://via.placeholder.com/40'} 
                  alt={requester.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{requester.name}</p>
                  <p className="text-sm text-gray-500">{requester.department}</p>
                  <p className="text-sm text-gray-500">{requester.email}</p>
                </div>
              </div>
            )}
          </Card>
          
          {/* Approvals */}
          <Card title="Approval History">
            {indent.approvals && indent.approvals.length > 0 ? (
              <div className="space-y-4">
                {indent.approvals.map(approval => (
                  <div key={approval.id} className="border-l-4 pl-4 py-2 border-gray-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{getApproverName(approval.approverId)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(approval.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge status={approval.status} type="approval" />
                    </div>
                    {approval.remarks && (
                      <p className="text-sm mt-2">{approval.remarks}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No approvals yet</p>
            )}
          </Card>
        </div>
      </div>
      
      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add Approval
                    </h3>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Approval Status
                        </label>
                        <div className="mt-2 space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-5 w-5 text-indigo-600"
                              value="approved"
                              checked={approvalStatus === 'approved'}
                              onChange={() => setApprovalStatus('approved')}
                            />
                            <span className="ml-2 text-gray-700">Approve</span>
                          </label>
                          
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-5 w-5 text-red-600"
                              value="rejected"
                              checked={approvalStatus === 'rejected'}
                              onChange={() => setApprovalStatus('rejected')}
                            />
                            <span className="ml-2 text-gray-700">Reject</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                          Remarks (optional)
                        </label>
                        <textarea
                          id="remarks"
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={approvalRemarks}
                          onChange={(e) => setApprovalRemarks(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  variant={approvalStatus === 'approved' ? 'success' : 'danger'}
                  leftIcon={approvalStatus === 'approved' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  className="w-full sm:w-auto sm:ml-3"
                  onClick={handleApproval}
                >
                  {approvalStatus === 'approved' ? 'Approve' : 'Reject'}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  onClick={() => setShowApprovalModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Purchase Order Modal */}
      {showPOModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Create Purchase Order
                    </h3>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Select Vendor
                      </label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={selectedVendorId}
                        onChange={(e) => setSelectedVendorId(e.target.value)}
                      >
                        <option value="">-- Select a vendor --</option>
                        {vendors.map(vendor => (
                          <option key={vendor.id} value={vendor.id}>
                            {vendor.name} ({vendor.itemCategories.join(', ')})
                          </option>
                        ))}
                      </select>
                      
                      {!selectedVendorId && (
                        <p className="mt-1 text-sm text-red-600">
                          Please select a vendor to proceed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  variant="success"
                  leftIcon={<ShoppingCart size={18} />}
                  className="w-full sm:w-auto sm:ml-3"
                  onClick={handleCreatePO}
                  disabled={!selectedVendorId}
                >
                  Create PO
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  onClick={() => setShowPOModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndentDetails;