import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    const reqBody = {
      username,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        reqBody        
      );
      console.log(response);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      navigate("/dashboard");
    } catch (err) {
      setError("Error in sign in")
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-600">
            Enter your credential to access your account
          </p>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSignin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm text-black font-bold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm text-black font-bold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            
          >
            Sign In
          </button>
        </form>
        <p className="text-gray-600 pt-2 text-center">
          {" "}
          Dont't have an Account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
