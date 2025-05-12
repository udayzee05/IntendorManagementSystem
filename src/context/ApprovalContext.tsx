import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ApprovalStage, Role } from '../types';
import { useNotifications } from './NotificationContext';

interface ApprovalContextType {
  approvalStages: ApprovalStage[];
  getNextApprovalStage: (currentAmount: number, currentStage?: ApprovalStage) => ApprovalStage | null;
  isApprovalRequired: (role: Role, amount: number) => boolean;
  getSLADeadline: (stage: ApprovalStage) => Date;
}

const defaultApprovalStages: ApprovalStage[] = [
  { role: 'manager', threshold: 50000, order: 1 },
  { role: 'director', threshold: 500000, order: 2 },
  { role: 'procurement_officer', threshold: Infinity, order: 3 }
];

const ApprovalContext = createContext<ApprovalContextType | undefined>(undefined);

export const ApprovalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [approvalStages] = useState<ApprovalStage[]>(defaultApprovalStages);
  const { showToast } = useNotifications();

  const getNextApprovalStage = (currentAmount: number, currentStage?: ApprovalStage): ApprovalStage | null => {
    const currentOrder = currentStage?.order || 0;
    const nextStages = approvalStages
      .filter(stage => stage.order > currentOrder && currentAmount <= stage.threshold)
      .sort((a, b) => a.order - b.order);

    return nextStages[0] || null;
  };

  const isApprovalRequired = (role: Role, amount: number): boolean => {
    const stage = approvalStages.find(s => s.role === role);
    return stage ? amount <= stage.threshold : false;
  };

  const getSLADeadline = (stage: ApprovalStage): Date => {
    const deadline = new Date();
    const hoursToAdd = {
      manager: 24,
      director: 48,
      procurement_officer: 72
    }[stage.role] || 24;

    deadline.setHours(deadline.getHours() + hoursToAdd);
    return deadline;
  };

  return (
    <ApprovalContext.Provider value={{
      approvalStages,
      getNextApprovalStage,
      isApprovalRequired,
      getSLADeadline
    }}>
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApproval = (): ApprovalContextType => {
  const context = useContext(ApprovalContext);
  if (context === undefined) {
    throw new Error('useApproval must be used within an ApprovalProvider');
  }
  return context;
};