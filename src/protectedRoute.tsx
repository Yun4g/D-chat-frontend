import {  useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "./store/store";
import { useEffect } from "react";
import { connectSocket } from "./lib/socket";
import { setUser } from "./store/slice/userSlice";
import api from "./api/axios";


function ProtectedRoute() {
 
  const authenticated = useSelector((state: RootState) => state.user.IsAuthenticated);
  console.log(authenticated);
  const dispatch = useDispatch()




  const getHyrationData = async () => {
      try {
        const res = await api.get('https://d-chat-backend-338h.onrender.com/api/me',
          {
            withCredentials: true,
          }
        );
        const user = res.data.user;
  
        connectSocket(user._id);
  
  
        dispatch(setUser({
          _id: user._id,
          userName: user.userName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          IsAuthenticated: true
        }));
      } catch (error) {
        console.log(error);
        dispatch(setUser({
          _id: '',
          userName: '',
          email: '',
          avatarUrl: '',
          IsAuthenticated: false
        }));
  
      }
    }
  
    useEffect(() => {
      getHyrationData();
    }, [])

  if (!authenticated) {
    return <Navigate to="/" replace />;
  };


  return <Outlet />;
}

export default ProtectedRoute;
