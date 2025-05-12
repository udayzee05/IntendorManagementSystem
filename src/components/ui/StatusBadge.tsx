import React from 'react';
import { Status, ApprovalStatus, Priority } from '../../types';

interface StatusBadgeProps {
  status: Status | ApprovalStatus | Priority;
  type?: 'status' | 'approval' | 'priority';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'status' }) => {
  const getStatusConfig = (): { label: string; bgColor: string; textColor: string } => {
    if (type === 'status') {
      switch (status) {
        case 'pending':
          return { label: 'Pending', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
        case 'approved':
          return { label: 'Approved', bgColor: 'bg-green-100', textColor: 'text-green-800' };
        case 'procurement_approved':
          return { label: 'Procurement Approved', bgColor: 'bg-purple-100', textColor: 'text-purple-800' };
        case 'rejected':
          return { label: 'Rejected', bgColor: 'bg-red-100', textColor: 'text-red-800' };
        case 'po_created':
          return { label: 'PO Created', bgColor: 'bg-amber-100', textColor: 'text-amber-800' };
        case 'completed':
          return { label: 'Completed', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' };
        default:
          return { label: status, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
      }
    } else if (type === 'approval') {
      switch (status) {
        case 'pending':
          return { label: 'Pending', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
        case 'approved':
          return { label: 'Approved', bgColor: 'bg-green-100', textColor: 'text-green-800' };
        case 'rejected':
          return { label: 'Rejected', bgColor: 'bg-red-100', textColor: 'text-red-800' };
        default:
          return { label: status, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
      }
    } else if (type === 'priority') {
      switch (status) {
        case 'low':
          return { label: 'Low', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
        case 'medium':
          return { label: 'Medium', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
        case 'high':
          return { label: 'High', bgColor: 'bg-amber-100', textColor: 'text-amber-800' };
        case 'urgent':
          return { label: 'Urgent', bgColor: 'bg-red-100', textColor: 'text-red-800' };
        default:
          return { label: status, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
      }
    }
    
    return { label: status, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  };

  const { label, bgColor, textColor } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

export default StatusBadge;