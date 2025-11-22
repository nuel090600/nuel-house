import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

// ✅ Use your Render backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "https://nuel-house.onrender.com";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("Login API Response:", data);

      if (!response.ok) {
        toast.error(data.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      if (data.status === 'success') {
        login(data.user, data.token); 
        toast.success('Login successful! Redirecting...');

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row bg-cover bg-center md:bg-none"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dqqectes0/image/upload/v1748531328/Frame_1000002379_czyuxy.png')",
      }}
    >
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-gray-700 hover:text-green-600 flex items-center z-20 cursor-pointer"
      >
        <HiArrowLeft className="text-2xl" />
        <span className="ml-1 text-sm font-medium">Back</span>
      </button>

      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12 md:px-10 bg-white bg-opacity-90 md:bg-opacity-100">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 text-center md:text-left">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-6 text-center md:text-left">
            Log in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />

            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              minLength={8}
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => toast.info('Google login coming soon!')}
            >
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              New here?{' '}
              <a href="/signup" className="text-green-600 font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative">
        <img
          src="https://res.cloudinary.com/dqqectes0/image/upload/v1748531328/Frame_1000002379_czyuxy.png"
          alt="Modern home interior"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Login;
