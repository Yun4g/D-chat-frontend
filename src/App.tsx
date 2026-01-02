
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Auth from './pages/auth'
import ForgotPassword from './component/forgotPassword'
import ChangePassword from './component/changePassword'
import ProtectedRoute from './protectedRoute'
import ChatDashboard from './pages/chatDashboard'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './store/slice/userSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);


  return (

    <section className='bg-[#051222] min-h-screen '>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ChangePassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<ChatDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </section>

  )
}

export default App
