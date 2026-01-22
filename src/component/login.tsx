import React from 'react';
import { EyeClosed, EyeIcon, Lock, } from "lucide-react";
import { motion } from 'framer-motion';
import useLogin from '@/hooks/useLogin';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, } from 'react-redux';
import { connectSocket } from '@/lib/socket';
import axios from 'axios';
import { setUser,} from '@/store/slice/userSlice';


function Login() {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState<string | null>(null);
    const [modalVariant, setModalVariant] = React.useState<'error' | 'success'>('error');
    const navigate = useNavigate();
    const { login, error, } = useLogin();
     console.log(error, 'loginErrorHook');




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setModalMessage(null);

        try {
            const user = await login(email, password); 
            console.log('Logged in user - raw response:', user);
            
            const userId = user._id || user.userId;
            console.log('Using userId:', userId);

            connectSocket(userId);

            const userPayload = {
                _id: userId,
                userName: user.userName || '',
                email: user.email || '',
                avatarUrl: user.avatarUrl || '',
                IsAuthenticated: true     
            };
            
            console.log('Dispatching user payload:', userPayload);
            dispatch(setUser(userPayload));
            
            setModalVariant('success');
            setModalMessage('Login successful! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 1500);

        } catch (error: unknown) {
            let message = 'Login failed';
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            setModalVariant('error');
            setModalMessage(message  );

        } finally {
            setLoading(false);
        }
    };


    return (
        <motion.div className='flex justify-center items-center flex-col w-full '
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6 }}
        >

            <h1 className='text-3xl text-white font-semibold '>Login</h1>
            <p className='text-sm text-gray-400 mt-2 mb-10'>Welcome back! Let’s pick up where you left off.</p>

            <form
                onSubmit={handleSubmit}
                className='w-full max-w-[500px] flex flex-col'>


                <div>
                    <label className='text-white block mt-4 mb-2'>Email</label>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} className='w-full p-3 rounded-full bg-[#23282d] text-white outline-none' placeholder='Enter your email' />
                    <label className='text-white block mt-4 mb-2'>Password</label>
                    <div>

                    </div>
                    <div className=" p-3 w-full rounded-full bg-[#23282d] flex items-center  relative">
                        <Lock className='text-white mr-2' size={16} />
                        <input type={showPassword ? "text" : "password"}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full bg-transparent border-0 h-fit text-white outline-none' placeholder='Enter your password' />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                        >
                            {showPassword ? <EyeIcon /> : <EyeClosed />}
                        </button>
                    </div>

                    <div className="flex justify-end mt-2  w-full">
                        <a
                            href='/forgot-password'
                            className="text-blue-600 hover:underline">Forgot Password?</a>
                    </div>
                </div>

                <button
                    type='submit'
                    className='mt-10 p-3 rounded-full bg-blue-600 text-white font-semibold'>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div className="mt-6 flex items-center text-gray-400 w-full max-w-[600px] mx-auto">
                <hr className="flex-1 border-gray-400" />
                <span className="px-4 text-center">powered by D-Tech Full stack developer</span>
                <hr className="flex-1 border-gray-400" />
            </div>

            <Modal
                visible={!!modalMessage}
                variant={modalVariant}
                message={modalMessage}
                onClose={() => setModalMessage(null)}
            />
        </motion.div>
    );
}

export default Login;