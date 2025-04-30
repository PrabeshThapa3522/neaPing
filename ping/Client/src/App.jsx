import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login/Login.jsx';
import MainDashboard from './Component/MainDashboard.jsx';
import ManageUser from './Component/Manage_User.jsx';

function App() {
  return (
    <>
      {/* <Login/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="dashboard" element ={<MainDashboard/>} />
          <Route path="manage_user" element ={<ManageUser/>} />
        </Routes>
      </BrowserRouter>
      {/* <Nav /> */}
      {/* <Dashboard/> */}
    </>
  )
}

export default App
