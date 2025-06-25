import 'font-awesome/css/font-awesome.min.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";

import Home from "./pages/Home";

import AllOrdersAdmin from './pages/adminordermangment/adminallorder';
import AdminOrderDetails from "./pages/adminordermangment/AdminOrderDetails";
import AdminQuotationPage from "./pages/adminordermangment/AdminQuotationPage";
import OrderManagementAdmin from './pages/adminordermangment/OrderManagementAdmin';
import Login from "./pages/Login";

import DrugsPage from './pages/DrugsPage';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AddPrescription from './pages/userorderManagement/AddPrecpection';
import OrderManagement from './pages/userorderManagement/orderManagement';
import PrescriptionSummary from './pages/userorderManagement/PrescriptionSummary';
import ViewOrders from './pages/userorderManagement/Vieworder';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
           <Route path="/prescriptions/:id/summary" element={<PrescriptionSummary />} />
            <Route path="/admin-all-orders" element={<AllOrdersAdmin />} />
            <Route path="/order-management-admin" element={<OrderManagementAdmin />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
<Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
            <Route path="/drugs" element={<DrugsPage />} />
            {/* Protected routes */}
            <Route
              path="/admin-dashboard"
              element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
            />
        <Route path="/admin/prescriptions/:id/quotation" element={<AdminQuotationPage />} />            <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
           
            <Route path="/order-management" element={<PrivateRoute><OrderManagement /></PrivateRoute>} />
            <Route path="/orders-now" element={<PrivateRoute>< AddPrescription /></PrivateRoute>} />
           <Route path="/view-orders" element={<PrivateRoute><ViewOrders /></PrivateRoute>} />


          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
