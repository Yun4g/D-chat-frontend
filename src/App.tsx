
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Auth from './pages/auth'
import ForgotPassword from './component/forgotPassword'
import ChangePassword from './component/changePassword'
import ProtectedRoute from './protectedRoute'
import ChatDashboard from './pages/chatDashboard'
import { useEffect } from 'react';
import {  useSelector } from 'react-redux';
import { connectSocket, socket } from './lib/socket'
import { RootState } from './store/store'


function App() {
  



  useEffect(() => {
    const handleInvite = (roomId: string) => {
      console.log("Invited to chat room:", roomId);
      socket.emit("joinRoom", roomId);
    };

    const handleAccepted = ({ roomId }: { roomId: string }) => {
      console.log("Friend request accepted. Room:", roomId);
      socket.emit("joinRoom", roomId);
    };

    socket.on("inviteToRoom", handleInvite);
    socket.on("friendRequestAccepted", handleAccepted);

    return () => {
      socket.off("inviteToRoom", handleInvite);
      socket.off("friendRequestAccepted", handleAccepted);
    };
  }, []);


  const user = useSelector((state: RootState) => state.user._id);

  useEffect(() => {
    if (user) {
      connectSocket(user);
      console.log("Socket should now be connected");
    }
  }, [user]);



  



  return (


    <section className='bg-[#051222] w-full overflow-x-hidden h-full min-h-screen '>
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
