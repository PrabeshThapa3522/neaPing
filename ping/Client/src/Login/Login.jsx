import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ThunderEffect.css";
import nea from "../assets/NEALOGO.png";
import logo from "../assets/ThunderEffect.png";
import loginBg from '../assets/login_bg.jpg';
import { FaUserAlt, FaLock } from "react-icons/fa";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
      const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });


    };
    /*  //user cannot use special character in username
     const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "username") {
      // Allow only letters, numbers, and underscores (no special characters)
      const validUsername = value.replace(/[^a-zA-Z0-9_]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: validUsername,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } */

      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true); // Show loading animation
        setErrorMessage(null); // Clear previous error messages

        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem("token", data.token);

                // Clear error message
                setErrorMessage(null);

                // Handle animation and redirect based on role
                setTimeout(() => {
                    setLoading(false); // Hide loading animation after 2.5 seconds
                    // if (data.role === "MD") {
                    //     navigate("/mdhome");
                    // } else if (data.role === "PA") {
                    //     navigate("/home");
                    // } else if (data.role === "Admin") {
                    //     navigate("/admin_dashboard");
                    // } else {
                    //     navigate("/gm_dashboard");
                    // }
                    navigate("/dashboard");
                }, 2500); // Show animation for 2.5 seconds
            } else {
                // Handle specific error messages
                if (data.message === "Too many login attempts. Please try again after 15 minutes.") {
                    setErrorMessage(data.message); // Set rate limit error message
                } else {
                    setErrorMessage(data.message || "Login failed. Please try again.");
                }
                setLoading(false); // Hide loading animation if login fails
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("An error occurred. Please try again.");
            setLoading(false); // Hide loading animation in case of error
        }
    };

    const handleCopyPaste = (event) => {
        event.preventDefault();
    };

    return (
        <div
        style={{ backgroundImage: `url(${loginBg})` }}
        className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
    >
        <div className="relative w-full max-w-[28rem] px-8 py-10 bg-gray-700/30 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col items-center mb-6">
                <img src={nea} alt="NEA LOGO" className="w-90 h-25 object-contain" />
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="mb-6 text-center text-md py-2 px-4 rounded-xl bg-red-500 text-gray-100">
                    {errorMessage}
                </div>
            )}

            <form className="space-y-6">
                <div className="flex items-center space-x-3">
                    <FaUserAlt className="text-2xl text-gray-300" />
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        autoComplete="off"
                        className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-gray-300"
                    />
                </div>

                <div className="flex items-center space-x-3">
                    <FaLock className="text-2xl text-gray-300" />
                    <input
                        type="password"
                        name="password"
                        onCopy={handleCopyPaste}
                        onPaste={handleCopyPaste}
                        onCut={handleCopyPaste}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2  focus:ring-blue-200 focus:bg-gray-300"
                    />
                </div>

                <div className="flex justify-between text-sm text-white px-1">
                    <button type="button" className="hover:cursor-pointer hover:text-gray-300">Remember me</button>
                    <button type="button" className="hover:cursor-pointer hover:text-gray-300">Forget Password?</button>
                </div>

                {/* Thunder Effect Animation */}
                {loading && (
                    <div className="flex justify-center">
                        <div className="relative flex justify-center items-center w-24 h-24">
                            <img src={logo} alt="ThunderEffect" className="absolute w-20 h-20" />
                            <svg
                                className="absolute top-10 left-11 w-11 h-13 transform -translate-x-1/2 -translate-y-1/2"
                                viewBox="0 0 100 100"
                            >
                                <polygon
                                    className="fill-[#010c2a] stroke-[#05173df1] stroke-[1] drop-shadow-[0_0_5px_#04377e] opacity-0 animate-thunder-flash"
                                    points="48.5,24.5 10,95.5 46.5,51 68,73.5 97.5,1 70,48.5 48.5,24.5"
                                />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="py-2 px-10 text-white font-semibold bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </div>

                {/* Sign Up Link (optional) */}
                {/* <div className="mt-4 text-sm text-center text-gray-200">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-400 hover:underline">
                        Sign Up
                    </Link>
                </div> */}
            </form>
        </div>
    </div>
    );
};

export default Login;