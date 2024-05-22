import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup, Signin, Dashboard, SendMoney } from "./components/index";
import React from "react";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthProvider";
import "./App.css";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/sendmoney" element={
                <PrivateRoute>
                  <SendMoney />
                </PrivateRoute>
              } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
