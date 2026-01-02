import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useForgotPassword from '@/hooks/useForgotpassword';
import Modal from './Modal';

type Props = {
    endpoint?: string;
    onSuccess?: (message?: string) => void;
};

const ForgotPassword: React.FC<Props> = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
     const [modalMessage, setModalMessage] = React.useState<string | null>(null);
     const [modalVariant, setModalVariant] = React.useState<'error' | 'success'>('error');
    const forgotpassword = useForgotPassword();
    const navigate = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!email) {
            setError('Email is required');
            return;
        }
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setError('Enter a valid email');
            return;
        }

        setLoading(true);
        try {
            await forgotpassword.forgotPassword(email);
            setSuccess('Password reset email sent successfully');
            setModalMessage('Password reset email sent successfully');
            setModalVariant('success');
        } catch (err: unknown) {
           console.error('Forgot Password error:', err);
           setModalMessage(err instanceof Error ? err.message : 'Failed to send password reset email');
           setModalVariant('error');
           setError(err instanceof Error ? err.message : 'Failed to send password reset email');
        } finally {
            setLoading(false);
        }
    };

        return (
                <motion.div className='flex min-h-screen justify-center items-center flex-col w-full p-2 '
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.6 }}
                >
                    <button
                        type='button'
                        onClick={() => navigate(-1)}
                        className=' text-gray-300 hover:text-white mb-4'
                    >
                        ← Back
                    </button>
            <h1 className='text-3xl text-white font-semibold '>Forgot Password</h1>
            <p className='text-sm text-gray-400 mt-2 mb-6'>Enter your email to receive reset instructions.</p>

            <form onSubmit={submit} className='w-full max-w-[600px] flex flex-col'>
                <label className='text-white block mt-4 mb-2'>Email Address</label>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-3 rounded-full bg-[#23282d] text-white outline-none'
                    placeholder='Enter your email'
                    required
                />

                {error && <p className='text-red-500 mt-3'>{error}</p>}
                {success && <p className='text-green-500 mt-3'>{success}</p>}

                <button
                    type='submit'
                    disabled={loading}
                    className='mt-6 p-3 rounded-full bg-blue-600 text-white font-semibold disabled:opacity-60'
                >
                    {loading ? 'Sending...' : 'Send reset link'}
                </button>
            </form>

            <div className="mt-6 flex items-center text-gray-400 w-full max-w-[600px] mx-auto">
                <hr className="flex-1 border-gray-400" />
                <span className="px-4 text-center">powered by D-Tech Full stack developer</span>
                <hr className="flex-1 border-gray-400" />
            </div>

                        <Modal visible={!!modalMessage} variant={modalVariant} message={modalMessage} onClose={() => { setModalMessage(null); setError(null); }} />

        </motion.div>
    );
};

export default ForgotPassword;