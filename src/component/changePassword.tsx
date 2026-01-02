import React, {useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useChangePassword from '@/hooks/useChangePassword';



const ChangePassword: React.FC= () => {
   const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
 const [confirm, setConfirm] = useState('');
 const [error, setError] = useState<string | null>(null);
 const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] =  useSearchParams();
  const changePasswordHook = useChangePassword();
  const navigate = useNavigate();

 React.useEffect(() => {
    const t = searchParams.get('token');
    if (t) {
      setToken(t);
    } 
  }, [searchParams]);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
    





  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      setError('No token provided');
      setLoading(false);
      return;
    }

    try {
      await changePasswordHook.changePassword(token, password, email);
      setSuccess('Password changed successfully');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(`Failed to change password: ${err instanceof Error ? err.message : ''}`);
      console.error('Change Password error:', err);
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
      setConfirm('');
      if(error){
        setSuccess(null);
      } else{
        setError(null);
      }

   
  };
}

  return (
    <motion.div className='flex min-h-screen justify-center items-center flex-col p-3 w-full'
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className='text-3xl text-white font-semibold'>Change Password</h1>
      <p className='text-sm text-gray-400 mt-2 mb-6'>Set a new password for your account.</p>

      <form onSubmit={submit} className='w-full max-w-[600px] flex flex-col'>
        {!token && (
          <p className='text-yellow-400 mb-3'>No token found in props or query params.</p>
        )}


          <label className='text-white block mt-4 mb-2'>Email</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full p-3 rounded-full bg-[#23282d] text-white outline-none'
          placeholder='Enter your email'
          required
        />

        <label className='text-white block mt-4 mb-2'>New password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full p-3 rounded-full bg-[#23282d] text-white outline-none'
          placeholder='Enter new password'
          required
        />

        <label className='text-white block mt-4 mb-2'>Confirm password</label>
        <input
          type='password'
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className='w-full p-3 rounded-full bg-[#23282d] text-white outline-none'
          placeholder='Repeat new password'
          required
        />



        {error ? <p className='text-red-500 mt-3'>{error}</p> : success ? <p className='text-green-500 mt-3'>{success}</p> : null}

        <button
          type='submit'
          disabled={loading}
          className='mt-6 p-3 rounded-full bg-blue-600 text-white font-semibold disabled:opacity-60'
        >
          {loading ? 'Saving...' : 'Change password'}
        </button>
      </form>

      <div className='mt-6 flex items-center text-gray-400 w-full max-w-[600px] mx-auto'>
        <hr className='flex-1 border-gray-400' />
        <span className='px-4 text-center'>powered by D-Tech Full stack developer</span>
        <hr className='flex-1 border-gray-400' />
      </div>
    </motion.div>
  );
};
export default ChangePassword;
