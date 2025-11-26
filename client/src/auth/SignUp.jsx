import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: ''
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: ''
    };
    let isValid = true;

    // First Name validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    // Last Name validation
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!strongPasswordRegex.test(password)) {
      newErrors.password = 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
      isValid = false;
    }

    // Confirm Password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Terms validation
    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordFocus = () => {
    toast.info(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      { autoClose: 6000, pauseOnHover: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (data.status !== 'success') {
        if (data.message?.toLowerCase().includes("email")) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        } else {
          toast.error(data.message || "Signup failed. Please try again.");
        }
        return;
      }

      // Store token and show success
      localStorage.setItem('token', data.token);
      setShowSuccessModal(true);
      toast.success("Account created successfully!");

    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalLogin = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row bg-cover bg-center md:bg-none"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dqqectes0/image/upload/v1748531328/Frame_1000002379_czyuxy.png')" }}
    >
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 text-gray-700 hover:text-green-600 flex items-center z-20 cursor-pointer"
      >
        <HiArrowLeft className="text-2xl" />
        <span className="ml-1 text-sm font-medium">Back</span>
      </button>

      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12 md:px-10 bg-white bg-opacity-90 md:bg-opacity-100">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-2 text-center md:text-left">
            Join our community of home seekers.
          </h2>
          <p className="text-gray-600 mb-6 text-center md:text-left">
            Let's get started by filling out the form.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-text ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.firstName}
                  </p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-text ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-text ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span> {errors.email}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                onFocus={handlePasswordFocus}
                placeholder="Enter your password"
                className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-text ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span> {errors.password}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full border p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-text ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span> {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={() => {
                    setAgreeToTerms(prev => !prev);
                    if (errors.agreeToTerms) {
                      setErrors(prev => ({ ...prev, agreeToTerms: '' }));
                    }
                  }}
                  className={`mt-1 h-4 w-4 text-green-600 rounded cursor-pointer focus:ring-green-500 ${
                    errors.agreeToTerms ? 'border-red-500' : ''
                  }`}
                />
                I agree to{" "}
                <a href="#" className="text-green-600 hover:underline cursor-pointer">Terms of Service</a>{" "}
                &{" "}
                <a href="#" className="text-green-600 hover:underline cursor-pointer">Privacy Policies</a>
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠</span> {errors.agreeToTerms}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isLoading ? "Processing..." : "Sign up"}
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
              className="w-full border border-gray-300 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
              onClick={() => toast.info('Google signup coming soon!')}
            >
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-green-600 font-medium hover:underline cursor-pointer">Sign in</a>
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

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mt-3">Signup Successful!</h3>
              <p className="text-gray-500 mt-2">Your account has been created successfully.</p>
              <div className="mt-6">
                <button 
                  onClick={handleModalLogin}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                >
                  Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;