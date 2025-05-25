import { useEffect } from 'react';
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore.js';

function App() {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div>
       <Toaster  reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login"/>} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/"/>} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/"/>} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
