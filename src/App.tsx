import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import { ApprovalProvider } from './context/ApprovalContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import IndentList from './pages/indents/IndentList';
import IndentForm from './pages/indents/IndentForm';
import IndentDetails from './pages/indents/IndentDetails';
import ApprovalList from './pages/approvals/ApprovalList';
import VendorList from './pages/vendors/VendorList';
import VendorForm from './pages/vendors/VendorForm';
import UserList from './pages/users/UserList';
import ReportDashboard from './pages/reports/ReportDashboard';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ApprovalProvider>
            <DataProvider>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="indents">
                    <Route index element={<IndentList />} />
                    <Route path="new" element={<IndentForm />} />
                    <Route path=":id" element={<IndentDetails />} />
                  </Route>
                  <Route path="approvals" element={<ApprovalList />} />
                  <Route path="vendors">
                    <Route index element={<VendorList />} />
                    <Route path="new" element={<VendorForm />} />
                    <Route path=":id" element={<VendorForm />} />
                  </Route>
                  <Route path="users" element={<UserList />} />
                  <Route path="reports" element={<ReportDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </DataProvider>
          </ApprovalProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;