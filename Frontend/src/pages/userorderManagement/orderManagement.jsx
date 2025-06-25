import { Eye, ShoppingCart } from "lucide-react"; // Using ShoppingCart icon for orders
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

const OrderManagement = () => {
  const navigate = useNavigate();
  const { name, role } = useAuth();

  console.log("Logged in user:", name, "Role:", role);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-8 w-full overflow-auto">
        <div className="text-3xl font-semibold mb-8">
          <h1>Order Management</h1>
          <p className="text-lg text-gray-500">Manage your orders effectively</p>
        </div>

        {/* Order Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">

          {/* See Orders Now */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingCart className="mr-2 text-blue-600" />
               Orders Now
            </h2>
            <p className="text-gray-700 mb-4">orders quickly.</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
              onClick={() => navigate("/orders-now")}
            >
               Order now
            </button>
          </div>

          {/* View All Orders */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Eye className="mr-2 text-green-600" />
              View All Orders
            </h2>
            <p className="text-gray-700 mb-4">Browse your complete order history.</p>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
              onClick={() => navigate("/view-orders")}
            >
              View Orders
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
