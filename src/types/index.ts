// User related types
export type Role = 'employee' | 'manager' | 'director' | 'procurement_officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  avatar?: string;
  password?: string; // Only included in mock data, would not exist in real app
}

// Status types
export type Status = 'draft' | 'pending_manager' | 'pending_director' | 'pending_procurement' | 'approved' | 'procurement_approved' | 'rejected' | 'po_created' | 'completed';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Indent related types
export interface IndentItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
  justification?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ApprovalStage {
  role: Role;
  threshold: number;
  order: number;
}

export interface Approval {
  id: string;
  indentId: string;
  approverId: string;
  status: ApprovalStatus;
  remarks?: string;
  timestamp: string;
  stage: ApprovalStage;
  slaBreached?: boolean;
}

export interface Indent {
  id: string;
  requesterId: string;
  department: string;
  date: string;
  status: Status;
  priority: Priority;
  title: string;
  description?: string;
  items: IndentItem[];
  approvals?: Approval[];
  attachments?: Attachment[];
  totalEstimatedCost?: number;
  budgetCode?: string;
  slaDeadline?: string;
  isDraft?: boolean;
}

// Vendor related types
export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  itemCategories: string[];
  rating?: number;
  performanceMetrics?: {
    onTimeDelivery: number;
    qualityRating: number;
    responseTime: number;
  };
}

// Purchase Order related types
export interface PurchaseOrder {
  id: string;
  indentId: string;
  vendorId: string;
  poNumber: string;
  amount: number;
  date: string;
  deliveryDate?: string;
  status?: 'issued' | 'accepted' | 'shipped' | 'delivered' | 'cancelled';
  attachments?: Attachment[];
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'indent_status' | 'approval_required' | 'sla_breach' | 'po_created';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}

// Budget related types
export interface BudgetAllocation {
  id: string;
  department: string;
  fiscalYear: string;
  amount: number;
  used: number;
  remaining: number;
}

// Audit log types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'indent' | 'approval' | 'po' | 'vendor' | 'user';
  entityId: string;
  changes: Record<string, any>;
  timestamp: string;
}

// Form types
export interface IndentFormValues {
  title: string;
  department: string;
  priority: Priority;
  description?: string;
  budgetCode?: string;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unit: string;
    estimatedCost?: number;
    justification?: string;
  }>;
  attachments?: File[];
}

// Dashboard types
export interface DashboardStats {
  pendingIndents: number;
  approvedIndents: number;
  rejectedIndents: number;
  totalPurchaseOrders: number;
  monthlySpend: number;
  slaBreaches: number;
  budgetUtilization: number;
}

// SLA Configuration
export interface SLAConfig {
  pending_manager: number; // hours
  pending_director: number;
  pending_procurement: number;
  po_creation: number;
}