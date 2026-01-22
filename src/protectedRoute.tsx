import {  useDispatch, useSelector } from "react-redux";
import {  Navigate, Outlet } from "react-router-dom";
import { RootState } from "./store/store";
import { useEffect } from "react";
import { connectSocket } from "./lib/socket";
import { setUser } from "./store/slice/userSlice";
import api from "./api/axios";


function ProtectedRoute() {
 
  const authenticated = useSelector((state: RootState) => state.user.IsAuthenticated);
  console.log(authenticated, 'authBoolean');
  const dispatch = useDispatch()




  const getHyrationData = async () => {
      try {
        const res = await api.get('/api/me', );
        const user = res.data?.user;
        
        if (!user || !user._id) {
          console.log('No user data from /api/me, keeping existing state');
          return;
        }
  
        connectSocket(user._id);
        dispatch(setUser({
          _id: user._id,
          userName: user.userName || '',
          email: user.email || '',
          avatarUrl: user.avatarUrl || '',
          IsAuthenticated: true
        }));
      } catch (error) {
        console.log('Error fetching user data:', error);
        if (!authenticated) {
          dispatch(setUser({
            _id: '',
            userName: '',
            email: '',
            avatarUrl: '',
            IsAuthenticated: false
          }));
        }
  
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
