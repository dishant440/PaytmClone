import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup, Signin, Dashboard, SendMoney } from './components/index';
import React from 'react'
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />    
          <Route path="/signin" element={<Signin />} />    
          <Route path="/dashboard" element={<Dashboard />} />    
          <Route path="/sendmoney" element={<SendMoney />} />    
        </Routes>
    </BrowserRouter>
      
    </>
  );
}

export default App;
