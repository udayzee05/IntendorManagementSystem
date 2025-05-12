import { User, Indent, Vendor, PurchaseOrder, Status, Priority } from '../types';

// Mock Users
export const mockUsers: (User & { password: string })[] = [
  {
    id: 'user1',
    name: 'John Employee',
    email: 'employee@example.com',
    password: 'password123',
    role: 'employee',
    department: 'Marketing',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 'user2',
    name: 'Sarah Manager',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager',
    department: 'Marketing',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 'user3',
    name: 'Alex Procurement',
    email: 'procurement@example.com',
    password: 'password123',
    role: 'procurement_officer',
    department: 'Procurement',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 'user4',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    department: 'Administration',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  }
];

// Mock Indents
export const mockIndents: Indent[] = [
  {
    id: 'indent1',
    requesterId: 'user1',
    department: 'Marketing',
    date: '2025-01-15',
    status: 'pending',
    priority: 'medium',
    title: 'Marketing Materials for Q1 Campaign',
    description: 'Materials needed for the upcoming Q1 marketing campaign',
    totalEstimatedCost: 2500,
    items: [
      {
        id: 'item1',
        name: 'Brochures',
        description: 'Full color tri-fold brochures',
        quantity: 500,
        unit: 'pieces',
        estimatedCost: 1000,
        justification: 'Needed for trade show next month'
      },
      {
        id: 'item2',
        name: 'Banners',
        description: 'Vinyl standing banners',
        quantity: 5,
        unit: 'pieces',
        estimatedCost: 1500,
        justification: 'For booth display at trade show'
      }
    ],
    approvals: []
  },
  {
    id: 'indent2',
    requesterId: 'user1',
    department: 'Marketing',
    date: '2025-01-10',
    status: 'approved',
    priority: 'high',
    title: 'Office Supplies',
    description: 'Replenishment of office supplies',
    totalEstimatedCost: 500,
    items: [
      {
        id: 'item3',
        name: 'Printer Paper',
        description: 'A4 size, 80gsm',
        quantity: 50,
        unit: 'reams',
        estimatedCost: 300,
        justification: 'Current stock is low'
      },
      {
        id: 'item4',
        name: 'Ink Cartridges',
        description: 'HP LaserJet Pro MFP',
        quantity: 5,
        unit: 'pieces',
        estimatedCost: 200,
        justification: 'Needed for printing reports'
      }
    ],
    approvals: [
      {
        id: 'approval1',
        indentId: 'indent2',
        approverId: 'user2',
        status: 'approved',
        remarks: 'Approved for purchase',
        timestamp: '2025-01-12T10:30:00Z'
      }
    ]
  },
  {
    id: 'indent3',
    requesterId: 'user1',
    department: 'Marketing',
    date: '2025-01-05',
    status: 'procurement_approved',
    priority: 'urgent',
    title: 'Laptop for New Designer',
    description: 'New laptop for the graphic designer joining next week',
    totalEstimatedCost: 2000,
    items: [
      {
        id: 'item5',
        name: 'MacBook Pro',
        description: '16-inch, 16GB RAM, 512GB SSD',
        quantity: 1,
        unit: 'piece',
        estimatedCost: 2000,
        justification: 'Required for the new graphic designer'
      }
    ],
    approvals: [
      {
        id: 'approval2',
        indentId: 'indent3',
        approverId: 'user2',
        status: 'approved',
        remarks: 'Approved as per joining requirement',
        timestamp: '2025-01-06T14:20:00Z'
      },
      {
        id: 'approval3',
        indentId: 'indent3',
        approverId: 'user3',
        status: 'approved',
        remarks: 'Procurement approved, assigning vendor',
        timestamp: '2025-01-07T09:15:00Z'
      }
    ]
  },
  {
    id: 'indent4',
    requesterId: 'user1',
    department: 'Marketing',
    date: '2025-01-01',
    status: 'po_created',
    priority: 'medium',
    title: 'Conference Room Equipment',
    description: 'Equipment for the new conference room',
    totalEstimatedCost: 5000,
    items: [
      {
        id: 'item6',
        name: 'Projector',
        description: '4K Ultra HD Projector',
        quantity: 1,
        unit: 'piece',
        estimatedCost: 3000,
        justification: 'Required for presentations'
      },
      {
        id: 'item7',
        name: 'Conference Table',
        description: '12-seater oval conference table',
        quantity: 1,
        unit: 'piece',
        estimatedCost: 2000,
        justification: 'For the new conference room'
      }
    ],
    approvals: [
      {
        id: 'approval4',
        indentId: 'indent4',
        approverId: 'user2',
        status: 'approved',
        remarks: 'Approved for the new conference room',
        timestamp: '2025-01-02T11:45:00Z'
      },
      {
        id: 'approval5',
        indentId: 'indent4',
        approverId: 'user3',
        status: 'approved',
        remarks: 'Procurement approved, PO created',
        timestamp: '2025-01-03T10:30:00Z'
      }
    ]
  },
  {
    id: 'indent5',
    requesterId: 'user1',
    department: 'Marketing',
    date: '2024-12-20',
    status: 'rejected',
    priority: 'low',
    title: 'Office Decoration',
    description: 'Decoration items for the office',
    totalEstimatedCost: 1000,
    items: [
      {
        id: 'item8',
        name: 'Indoor Plants',
        description: 'Assorted indoor plants with pots',
        quantity: 10,
        unit: 'pieces',
        estimatedCost: 500,
        justification: 'To improve office ambiance'
      },
      {
        id: 'item9',
        name: 'Wall Art',
        description: 'Motivational prints, framed',
        quantity: 5,
        unit: 'pieces',
        estimatedCost: 500,
        justification: 'For office walls'
      }
    ],
    approvals: [
      {
        id: 'approval6',
        indentId: 'indent5',
        approverId: 'user2',
        status: 'rejected',
        remarks: 'Not a priority at this time',
        timestamp: '2024-12-22T15:10:00Z'
      }
    ]
  }
];

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: 'vendor1',
    name: 'Office Supplies Co.',
    contactPerson: 'Mike Johnson',
    email: 'mike@officesupplies.example',
    phone: '555-1234',
    address: '123 Business Park, Suite 101, San Francisco, CA 94107',
    itemCategories: ['Office Supplies', 'Stationery', 'Printer Supplies'],
    rating: 4.5
  },
  {
    id: 'vendor2',
    name: 'Tech Solutions Inc.',
    contactPerson: 'Lisa Chen',
    email: 'lisa@techsolutions.example',
    phone: '555-5678',
    address: '456 Tech Avenue, San Jose, CA 95113',
    itemCategories: ['Computers', 'Electronics', 'Software'],
    rating: 4.8
  },
  {
    id: 'vendor3',
    name: 'Furniture World',
    contactPerson: 'Robert Smith',
    email: 'robert@furnitureworld.example',
    phone: '555-9012',
    address: '789 Industrial Blvd, Oakland, CA 94607',
    itemCategories: ['Office Furniture', 'Chairs', 'Tables'],
    rating: 4.2
  },
  {
    id: 'vendor4',
    name: 'Marketing Materials Pro',
    contactPerson: 'Jennifer Adams',
    email: 'jennifer@marketingpro.example',
    phone: '555-3456',
    address: '101 Print Street, Berkeley, CA 94710',
    itemCategories: ['Brochures', 'Banners', 'Promotional Items'],
    rating: 4.7
  }
];

// Mock Purchase Orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po1',
    indentId: 'indent4',
    vendorId: 'vendor3',
    poNumber: 'PO-2025-001',
    amount: 5000,
    date: '2025-01-04',
    deliveryDate: '2025-01-20',
    status: 'issued'
  }
];