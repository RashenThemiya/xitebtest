import { CheckCircle, ClipboardList, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebaradmin";
import { useAuth } from "../../context/AuthContext"; // adjust if needed

const OrderManagementAdmin = () => {
  const navigate = useNavigate();
  const { name, role } = useAuth();

  console.log("Admin user:", name, "Role:", role);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-8 w-full overflow-auto">
        <div className="text-3xl font-semibold mb-8">
          <h1>Order Management</h1>
          <p className="text-lg text-gray-500">Monitor, process, and manage all orders</p>
        </div>

        {/* Order Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* View All Orders */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ClipboardList className="mr-2 text-blue-600" />
              View All Orders
            </h2>
            <p className="text-gray-700 mb-4">Access all order details in one place.</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
              onClick={() => navigate("/admin-all-orders")}
            >
              View Orders
            </button>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="mr-2 text-yellow-500" />
              Pending Orders
            </h2>
            <p className="text-gray-700 mb-4">Review and take action on pending orders.</p>
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 w-full sm:w-auto"
              onClick={() => navigate("/admin/orders/pending")}
            >
              Pending Orders
            </button>
          </div>

          {/* Completed Orders */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="mr-2 text-green-600" />
              Completed Orders
            </h2>
            <p className="text-gray-700 mb-4">View history of all fulfilled orders.</p>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
              onClick={() => navigate("/admin/orders/completed")}
            >
              Completed Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementAdmin;
