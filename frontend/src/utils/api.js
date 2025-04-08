import axios from 'axios';

// Create axios instance with base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock user data for development/testing
const mockUsers = [
  {
    _id: 'mcp123',
    name: 'MCP Admin',
    email: 'admin@mcp.com',
    role: 'mcp',
    phone: '1234567890',
    status: 'active',
  },
  {
    _id: 'partner123',
    name: 'Partner User',
    email: 'partner@example.com',
    role: 'pickup_partner',
    phone: '9876543210',
    status: 'active',
  },
];

// Mock collections data
const mockCollections = [
  {
    _id: 'collection1',
    name: 'Plastic Collection - Downtown',
    location: '123 Main St, Downtown',
    scheduledDate: new Date().toISOString(),
    preferredTime: '10:00 AM - 2:00 PM',
    status: 'pending',
    notes: 'Large quantity of plastic bottles',
    assignedTo: null,
  },
  {
    _id: 'collection2',
    name: 'Paper Collection - Midtown',
    location: '456 Park Ave, Midtown',
    scheduledDate: new Date().toISOString(),
    preferredTime: '1:00 PM - 5:00 PM',
    status: 'assigned',
    notes: 'Newspapers and cardboard boxes',
    assignedTo: 'partner123',
  },
];

// Mock stats data
const mockStats = {
  totalCollections: 48,
  activePickups: 12,
  totalEarnings: 24500,
  partnersCount: 8,
  dailyCollections: [
    { date: '2023-09-01', amount: 450 },
    { date: '2023-09-02', amount: 320 },
    { date: '2023-09-03', amount: 580 },
    { date: '2023-09-04', amount: 250 },
    { date: '2023-09-05', amount: 740 },
    { date: '2023-09-06', amount: 610 },
    { date: '2023-09-07', amount: 890 },
  ]
};

// Mock wallet data
const mockWallet = {
  balance: 18500,
  totalEarnings: 24500,
  totalWithdrawals: 6000,
  pendingAmount: 3200
};

// Mock partners data
const mockPartners = [
  { id: 'p1', name: 'Eco Pickup Services', activeCollections: 4, completedCollections: 28, rating: 4.8 },
  { id: 'p2', name: 'Green Waste Solutions', activeCollections: 3, completedCollections: 15, rating: 4.6 },
  { id: 'p3', name: 'City Recyclers', activeCollections: 2, completedCollections: 34, rating: 4.9 },
  { id: 'p4', name: 'Urban Waste Management', activeCollections: 3, completedCollections: 22, rating: 4.5 },
];

// Mock notifications data
const mockNotifications = [
  { 
    _id: 'n1', 
    title: 'New Collection Request', 
    message: 'A new collection request has been submitted in your area.', 
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false 
  },
  { 
    _id: 'n2', 
    title: 'Payment Received', 
    message: 'You have received a payment of ₹450 for your recent collection.', 
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: true 
  },
  { 
    _id: 'n3', 
    title: 'System Maintenance', 
    message: 'The platform will be down for maintenance on Sunday from 2 AM to 4 AM.', 
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    read: false 
  },
  { 
    _id: 'n4', 
    title: 'New Partner Joined', 
    message: 'Eco Friendly Recyclers has joined as a pickup partner in your area.', 
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    read: true 
  }
];

// Mock orders data
const mockOrders = [
  {
    _id: 'order1',
    orderNumber: 'ORD-2023-001',
    collectionId: 'collection1',
    customerId: 'customer1',
    customerName: 'Eco Innovations Ltd',
    items: [
      { type: 'Plastic', weight: 35, rate: 15, amount: 525 },
      { type: 'Paper', weight: 20, rate: 10, amount: 200 }
    ],
    totalWeight: 55,
    totalAmount: 725,
    status: 'completed',
    pickupDate: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    _id: 'order2',
    orderNumber: 'ORD-2023-002',
    collectionId: 'collection2',
    customerId: 'customer2',
    customerName: 'Green Office Solutions',
    items: [
      { type: 'Paper', weight: 45, rate: 10, amount: 450 },
      { type: 'Cardboard', weight: 30, rate: 8, amount: 240 }
    ],
    totalWeight: 75,
    totalAmount: 690,
    status: 'processing',
    pickupDate: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    _id: 'order3',
    orderNumber: 'ORD-2023-003',
    collectionId: 'collection3',
    customerId: 'customer3',
    customerName: 'City Waste Management',
    items: [
      { type: 'Metal', weight: 25, rate: 30, amount: 750 },
      { type: 'E-waste', weight: 15, rate: 50, amount: 750 }
    ],
    totalWeight: 40,
    totalAmount: 1500,
    status: 'pending',
    pickupDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  }
];

// Create mock API implementation
const mockApi = {
  // Auth endpoints
  login: async (credentials) => {
    const { email, password } = credentials;
    // Mock login validation
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password123') {
      const token = `mock-token-${user._id}`;
      localStorage.setItem('token', token);
      return { token, user };
    }
    
    throw { 
      response: { 
        data: { message: 'Invalid email or password' },
        status: 401
      }
    };
  },
  
  register: async (userData) => {
    const { email } = userData;
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      throw { 
        response: { 
          data: { message: 'User with this email already exists' },
          status: 400
        }
      };
    }
    
    // Create new mock user
    const newUser = {
      _id: `user${Date.now()}`,
      ...userData,
      status: 'active'
    };
    
    mockUsers.push(newUser);
    
    const token = `mock-token-${newUser._id}`;
    localStorage.setItem('token', token);
    
    return { token, user: newUser };
  },
  
  getUserProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw { 
        response: { 
          data: { message: 'Not authenticated' },
          status: 401
        }
      };
    }
    
    const userId = token.split('-')[2];
    const user = mockUsers.find(u => u._id === userId);
    
    if (!user) {
      throw { 
        response: { 
          data: { message: 'User not found' },
          status: 404
        }
      };
    }
    
    return user;
  },
  
  forgotPassword: async (email) => {
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw { 
        response: { 
          data: { message: 'User with this email does not exist' },
          status: 404
        }
      };
    }
    
    return { message: 'Password reset email sent' };
  },
  
  resetPassword: async (token, password) => {
    // In a real app, we would validate the token
    // For mock, just return success
    return { message: 'Password reset successful' };
  },
  
  updateProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw { 
        response: { 
          data: { message: 'Not authenticated' },
          status: 401
        }
      };
    }
    
    const userId = token.split('-')[2];
    const userIndex = mockUsers.findIndex(u => u._id === userId);
    
    if (userIndex === -1) {
      throw { 
        response: { 
          data: { message: 'User not found' },
          status: 404
        }
      };
    }
    
    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...profileData
    };
    
    return mockUsers[userIndex];
  },
  
  updatePartnerProfile: async (profileData) => {
    // Same as updateProfile for mock purposes
    return this.updateProfile(profileData);
  },
  
  // Collection endpoints
  getMCPCollections: async () => {
    return mockCollections;
  },
  
  getPartnerCollections: async () => {
    const token = localStorage.getItem('token');
    const userId = token.split('-')[2];
    
    return mockCollections.filter(c => c.assignedTo === userId);
  },
  
  getAvailableCollections: async () => {
    return mockCollections.filter(c => c.status === 'pending');
  },
  
  // Stats endpoints
  getMCPStats: async () => {
    return mockStats;
  },
  
  // Wallet endpoints
  getMCPWallet: async () => {
    return mockWallet;
  },
  
  getMCPTransactions: async () => {
    return [
      { id: 't1', type: 'collection', amount: 450, date: '2023-09-07', status: 'completed' },
      { id: 't2', type: 'withdrawal', amount: -2000, date: '2023-09-05', status: 'completed' },
      { id: 't3', type: 'collection', amount: 320, date: '2023-09-03', status: 'completed' },
      { id: 't4', type: 'collection', amount: 580, date: '2023-09-01', status: 'completed' },
    ];
  },
  
  // Partner endpoints
  getMCPPartners: async () => {
    return mockPartners;
  },
  
  // Notifications endpoints
  getNotifications: async () => {
    return mockNotifications;
  },
  
  deleteNotification: async (notificationId) => {
    const index = mockNotifications.findIndex(n => n._id === notificationId);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
    return { success: true };
  },
  
  // Order endpoints
  getMCPOrders: async () => {
    return mockOrders;
  },
  
  getPartnerOrders: async () => {
    // Filter orders based on assigned partner
    return mockOrders.filter(order => order.status !== 'completed');
  },
  
  createOrder: async (orderData) => {
    const newOrder = {
      _id: `order${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(3, '0')}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    mockOrders.unshift(newOrder);
    return newOrder;
  },
  
  updateOrderStatus: async (orderId, status) => {
    const orderIndex = mockOrders.findIndex(order => order._id === orderId);
    if (orderIndex === -1) {
      throw {
        response: {
          data: { message: 'Order not found' },
          status: 404
        }
      };
    }
    
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return mockOrders[orderIndex];
  },
  
  // Mock implementations for other endpoints can be added as needed
};

// Export real API in production, mock API in development
// This allows for easy testing without a backend
const apiService = process.env.NODE_ENV === 'production' ? api : mockApi;

export default apiService; 