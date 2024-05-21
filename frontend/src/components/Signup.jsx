import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
        firstname,
        lastname,
        email,
        password
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Signup Failed Try again")
      
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-gray-600">Enter your information to create an account</p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm text-black font-bold">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstname"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={e => setFirstname(e.target.value)}
              value={firstname}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm text-black font-bold">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastname"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={e => setLastname(e.target.value)}
              value={lastname}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-black font-bold">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-black font-bold">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-600 pt-2 text-center">
          Already have an account? <span className="underline cursor-pointer" onClick={() => navigate("/signin")}>Login</span>
        </p>
      </div>
    </div>
  );
}
