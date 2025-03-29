import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';
import WorkList  from './pages/client/WorkList';
import PostWorkForm from './components/client/PostWorkForm';
import ApplyWorkPage from './pages/worker/ApplyWork';
function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post-work" element={<PostWorkForm/>} />
        <Route path="/" element={<WorkList />} />
        <Route path="/work/apply/:jobId" element={<ApplyWorkPage/>} />

      </Routes>
    </Router>
  );
}

export default App;
