import 'font-awesome/css/font-awesome.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

import AdminDashboard from "./pages/AdminDashboard";
import AllOrdersAdmin from './pages/adminordermangment/adminallorder';
import AdminOrderDetails from "./pages/adminordermangment/AdminOrderDetails";
import AdminQuotationPage from "./pages/adminordermangment/AdminQuotationPage";
import OrderManagementAdmin from './pages/adminordermangment/OrderManagementAdmin';
import DrugsPage from './pages/DrugsPage';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AddPrescription from './pages/userorderManagement/AddPrecpection';
import OrderManagement from './pages/userorderManagement/orderManagement';
import PrescriptionSummary from './pages/userorderManagement/PrescriptionSummary';
import ViewOrders from './pages/userorderManagement/Vieworder';

function App() {
  return (
    <BrowserRouter basename="/xitebtest">
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private routes */}
            <Route
              path="/prescriptions/:id/summary"
              element={
                <PrivateRoute><PrescriptionSummary /></PrivateRoute>
              }
            />
            <Route
              path="/admin-all-orders"
              element={
                <PrivateRoute><AllOrdersAdmin /></PrivateRoute>
              }
            />
            <Route
              path="/order-management-admin"
              element={
                <PrivateRoute><OrderManagementAdmin /></PrivateRoute>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <PrivateRoute><AdminOrderDetails /></PrivateRoute>
              }
            />
            <Route
              path="/drugs"
              element={
                <PrivateRoute><DrugsPage /></PrivateRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute><AdminDashboard /></PrivateRoute>
              }
            />
            <Route
              path="/admin/prescriptions/:id/quotation"
              element={
                <PrivateRoute><AdminQuotationPage /></PrivateRoute>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <PrivateRoute><UserDashboard /></PrivateRoute>
              }
            />
            <Route
              path="/order-management"
              element={
                <PrivateRoute><OrderManagement /></PrivateRoute>
              }
            />
            <Route
              path="/orders-now"
              element={
                <PrivateRoute><AddPrescription /></PrivateRoute>
              }
            />
            <Route
              path="/view-orders"
              element={
                <PrivateRoute><ViewOrders /></PrivateRoute>
              }
            />
          </Routes>
          <ToastContainer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
