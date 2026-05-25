import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import BrowseItems from "./pages/BrowseItems.jsx";
import ItemDetails from "./pages/ItemDetails.jsx";
import ReportItem from "./pages/ReportItem.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyPosts from "./pages/MyPosts.jsx";
import MyClaims from "./pages/MyClaims.jsx";
import ReceivedClaims from "./pages/ReceivedClaims.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div className="min-h-screen bg-ink font-body text-cream">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<BrowseItems />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/report" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
        <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
        <Route path="/my-claims" element={<ProtectedRoute><MyClaims /></ProtectedRoute>} />
        <Route path="/received-claims" element={<ProtectedRoute><ReceivedClaims /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
