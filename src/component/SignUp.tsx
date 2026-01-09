import React from 'react';
import { Camera, EyeClosed, EyeIcon, Lock, User } from "lucide-react";
import { motion } from 'framer-motion';
import useSignUp from '@/hooks/useSignup';

import Modal from './Modal';
import { socket } from '@/lib/socket';



interface signUpProp {
    setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>
}


function SignUp({setIsSignIn} : signUpProp) {
    const profileRef = React.useRef<HTMLInputElement>(null);
    const [profilePicture, setProfilePicture] = React.useState<File | null>(null);
    const [showPassword, setShowPassword] = React.useState(false);

    const [userName, setUserName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState<{ [k: string]: string }>({});
    const [modalMessage, setModalMessage] = React.useState<string | null>(null);
    const [modalVariant, setModalVariant] = React.useState<'error' | 'success'>('error');
    const signUp = useSignUp();

    React.useEffect(() => {
        if (signUp.error) {
            setModalVariant('error');
            setModalMessage(signUp.error);
        }
    }, [signUp.error]);


    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    const triggerFileSelect = () => {
        profileRef.current?.click();
    }



    const validate = () => {
        const newErrors: { [k: string]: string } = {};
        if (!userName.trim()) newErrors.username = 'Username is required';
        else if (userName.trim().length < 3) newErrors.username = 'Username must be at least 3 characters';

        if (!email.trim()) newErrors.email = 'Email is required';
        else {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
            if (!re.test(email)) newErrors.email = 'Enter a valid email';
        }

        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if(!profilePicture) newErrors.password = 'profile Picture is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) return;

        const formData = new FormData();
        formData.append("userName", userName);
        formData.append("email", email);
        formData.append("password", password);

        if (profilePicture) {
            formData.append("avatarUrl", profilePicture);
        }

        try {
            const res = await signUp.signUp(formData);
            console.log("Signup response in component:", res);
            if (signUp.data) {
                socket.emit("joinRoom", signUp.data._id)
                setTimeout(() => setIsSignIn(true), 1700);
            }

            if (res) {
                setModalVariant("success");
                setModalMessage(res.message ?? "Signup successful!");  
                setIsSignIn(true) 
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Signup failed";
            setModalVariant("error");
            setModalMessage(msg);
        } 
    };



    return (
        <motion.div className='flex justify-center items-center flex-col w-full '
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className='text-3xl text-white font-semibold '>Create Account</h1>
            <p className='text-sm text-gray-400 mt-2 mb-10'>Connect. Chat. Repeat.</p>

            <form
                onSubmit={handleSubmit}
                className='w-full max-w-[500px] flex flex-col' >
                <div>
                    <div
                        onClick={triggerFileSelect}
                        className='h-[120px] relative w-[120px] rounded-full bg-[#23282d] flex justify-center items-center mx-auto'>

                        {profilePicture ? (
                            <img
                                src={URL.createObjectURL(profilePicture)}
                                alt="Profile Picture"
                                className='h-full w-full rounded-full object-cover'
                            />
                        ) : (
                            <User className='text-white' size={50} />
                        )}
                        <div className='absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer'>
                            <Camera className='text-white' size={16} />
                        </div>
                    </div>
                    <div className='mt-2 text-center'>
                        <label htmlFor="profilePicture" className='cursor-pointer text-blue-600 flex justify-center items-center gap-2'>
                            <span>Add Profile Picture</span>
                            <input type="file" ref={profileRef} accept="image/*" id="profilePicture" onChange={handleProfilePictureChange} className='hidden' />
                        </label>
                    </div>
                </div>

                <div>
                    <label className='text-white block mt-4 mb-2'>Username</label>
                    <input value={userName} onChange={e => setUserName(e.target.value)} type="text" className='w-full p-3 rounded-full bg-[#23282d] text-white outline-none' placeholder='Enter your username' />
                    {errors.username && <p className='text-red-400 text-sm mt-1'>{errors.username}</p>}

                    <label className='text-white block mt-4 mb-2'>Email Address</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" className='w-full p-3 rounded-full bg-[#23282d] text-white outline-none' placeholder='Enter your email' />
                    {errors.email && <p className='text-red-400 text-sm mt-1'>{errors.email}</p>}

                    <label className='text-white block mt-4 mb-2'>Password</label>
                    <div>

                    </div>
                    <div className=" p-3 w-full rounded-full bg-[#23282d] flex items-center  relative">
                        <Lock className='text-white mr-2' size={16} />
                        <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} className='w-full bg-transparent border-0 h-fit text-white outline-none' placeholder='Enter your password' />
                        {errors.password && <p className='text-red-400 text-sm mt-1 absolute left-3 -bottom-6'>{errors.password}</p>}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                        >
                            {showPassword ? <EyeIcon /> : <EyeClosed />}
                        </button>
                    </div>
                </div>

                <button
                    type='submit'
                    className='mt-10 p-3 rounded-full bg-blue-600 text-white font-semibold'>
                    {signUp.loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            <div className="mt-6 flex items-center text-gray-400 w-full max-w-[600px] mx-auto">
                <hr className="flex-1 border-gray-400" />
                <span className="px-4 text-center">powered by D-Tech Full stack developer</span>
                <hr className="flex-1 border-gray-400" />
            </div>


            <Modal visible={!!modalMessage} variant={modalVariant} message={modalMessage} onClose={() => { setModalMessage(null); setErrors(prev => { const copy = { ...prev }; delete copy.general; return copy; }); }} />

        </motion.div>
    );
}

export default SignUp;