import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { setAuthToken } from './axiosConfig';

import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';
import PostWork from './pages/client/PostWork';
import WorkList  from './pages/client/WorkList';
function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post-work" element={<PostWork/>} />
        <Route path="/" element={<WorkList />} />
      </Routes>
    </Router>
  );
}

export default App;
