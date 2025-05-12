import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Approval, ApprovalStage } from '../../types';

interface ApprovalTimelineProps {
  approvals: Approval[];
  currentStage?: ApprovalStage;
  slaDeadline?: string;
}

const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({
  approvals,
  currentStage,
  slaDeadline
}) => {
  const getStatusIcon = (status: string, slaBreached?: boolean) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return slaBreached ? 
          <AlertTriangle className="h-5 w-5 text-amber-500" /> :
          <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {approvals.map((approval, idx) => (
          <li key={approval.id}>
            <div className="relative pb-8">
              {idx !== approvals.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-100">
                    {getStatusIcon(approval.status, approval.slaBreached)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {approval.stage.role.charAt(0).toUpperCase() + approval.stage.role.slice(1)} {' '}
                      <span className="font-medium text-gray-900">
                        {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </span>
                    </p>
                    {approval.remarks && (
                      <p className="mt-1 text-sm text-gray-600">{approval.remarks}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {format(new Date(approval.timestamp), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
        
        {currentStage && (
          <li>
            <div className="relative pb-8">
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-blue-50">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      Awaiting {currentStage.role.charAt(0).toUpperCase() + currentStage.role.slice(1)} Approval
                    </p>
                  </div>
                  {slaDeadline && (
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      Due by {format(new Date(slaDeadline), 'MMM d, yyyy HH:mm')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ApprovalTimeline;