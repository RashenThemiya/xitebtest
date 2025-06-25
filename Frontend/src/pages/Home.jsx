import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <h1 className="text-5xl font-extrabold text-blue-900 mb-8 drop-shadow-md">
        Welcome to Pharmacy
      </h1>
      <p className="text-xl text-blue-700 mb-12 max-w-xl text-center">
        Order now and get your medicines delivered fast and safely to your doorstep!
      </p>

      <div className="space-x-6 flex flex-wrap justify-center">
        <button
          onClick={() => navigate("/register")}
          className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded shadow-lg transform transition-transform duration-200 hover:-translate-y-1"
          aria-label="Register"
        >
          <FaUserPlus size={22} />
          <span>Register</span>
        </button>

        <button
          onClick={() => navigate("/login")}
          className="flex items-center space-x-3 bg-white border border-blue-600 text-blue-600 font-semibold px-8 py-3 rounded shadow-lg hover:bg-blue-100 transform transition-transform duration-200 hover:-translate-y-1"
          aria-label="Login"
        >
          <FaSignInAlt size={22} />
          <span>Login</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
