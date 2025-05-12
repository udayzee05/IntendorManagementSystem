import React, { createContext, useState, useContext, ReactNode } from 'react';
import { mockIndents, mockVendors, mockPurchaseOrders } from '../data/mockData';
import { Indent, Vendor, PurchaseOrder, IndentItem, Approval, Status } from '../types';
import { format } from 'date-fns';

interface DataContextType {
  indents: Indent[];
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  
  // Indent functions
  addIndent: (indent: Omit<Indent, 'id' | 'status' | 'date'> & { items: Omit<IndentItem, 'id'>[] }) => string;
  updateIndent: (id: string, updates: Partial<Indent>) => boolean;
  getIndentById: (id: string) => Indent | undefined;
  
  // Approval functions
  addApproval: (approval: Omit<Approval, 'id' | 'timestamp'>) => string;
  
  // Vendor functions
  addVendor: (vendor: Omit<Vendor, 'id'>) => string;
  updateVendor: (id: string, updates: Partial<Vendor>) => boolean;
  getVendorById: (id: string) => Vendor | undefined;
  
  // PO functions
  createPurchaseOrder: (indentId: string, vendorId: string) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [indents, setIndents] = useState<Indent[]>(mockIndents);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);

  // Generate a simple UUID for demo purposes
  const generateId = (): string => Math.random().toString(36).substring(2, 11);

  // Indent functions
  const addIndent = (indentData: Omit<Indent, 'id' | 'status' | 'date'> & { items: Omit<IndentItem, 'id'>[] }): string => {
    const id = generateId();
    const date = format(new Date(), 'yyyy-MM-dd');
    
    const newItems = indentData.items.map(item => ({
      ...item,
      id: generateId()
    }));
    
    const newIndent: Indent = {
      id,
      date,
      status: 'pending',
      ...indentData,
      items: newItems
    };
    
    setIndents(prev => [...prev, newIndent]);
    return id;
  };

  const updateIndent = (id: string, updates: Partial<Indent>): boolean => {
    let found = false;
    
    setIndents(prev => prev.map(indent => {
      if (indent.id === id) {
        found = true;
        return { ...indent, ...updates };
      }
      return indent;
    }));
    
    return found;
  };

  const getIndentById = (id: string): Indent | undefined => {
    return indents.find(indent => indent.id === id);
  };

  // Approval functions
  const addApproval = (approvalData: Omit<Approval, 'id' | 'timestamp'>): string => {
    const id = generateId();
    const timestamp = new Date().toISOString();
    
    const indentId = approvalData.indentId;
    const indent = getIndentById(indentId);
    
    if (indent) {
      // Update indent status based on approval
      let newStatus: Status = indent.status;
      
      if (approvalData.status === 'approved') {
        // If manager approves, move to procurement
        if (indent.status === 'pending') {
          newStatus = 'approved';
        }
        // If procurement approves, move to procurement_approved
        else if (indent.status === 'approved') {
          newStatus = 'procurement_approved';
        }
      } else if (approvalData.status === 'rejected') {
        newStatus = 'rejected';
      }
      
      updateIndent(indentId, { status: newStatus });
    }
    
    return id;
  };

  // Vendor functions
  const addVendor = (vendorData: Omit<Vendor, 'id'>): string => {
    const id = generateId();
    const newVendor: Vendor = { id, ...vendorData };
    
    setVendors(prev => [...prev, newVendor]);
    return id;
  };

  const updateVendor = (id: string, updates: Partial<Vendor>): boolean => {
    let found = false;
    
    setVendors(prev => prev.map(vendor => {
      if (vendor.id === id) {
        found = true;
        return { ...vendor, ...updates };
      }
      return vendor;
    }));
    
    return found;
  };

  const getVendorById = (id: string): Vendor | undefined => {
    return vendors.find(vendor => vendor.id === id);
  };

  // Purchase Order functions
  const createPurchaseOrder = (indentId: string, vendorId: string): string => {
    const id = generateId();
    const poNumber = `PO-${Date.now().toString().substring(7)}`;
    
    const newPO: PurchaseOrder = {
      id,
      indentId,
      vendorId,
      poNumber,
      amount: 0, // This would be calculated in a real app
      date: format(new Date(), 'yyyy-MM-dd')
    };
    
    setPurchaseOrders(prev => [...prev, newPO]);
    
    // Update indent status to purchased
    updateIndent(indentId, { status: 'po_created' });
    
    return id;
  };

  const contextValue: DataContextType = {
    indents,
    vendors,
    purchaseOrders,
    addIndent,
    updateIndent,
    getIndentById,
    addApproval,
    addVendor,
    updateVendor,
    getVendorById,
    createPurchaseOrder
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};