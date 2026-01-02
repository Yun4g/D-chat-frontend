import Login from '@/component/login';
import SignUp from '@/component/SignUp';
import React from 'react';

function Auth() {
    const [isSignIn, setIsSignIn] = React.useState(true);
    return (
        <section className='flex flex-col p-3 gap-3  md:p-7 justify-center items-center min-h-screen'>
            <h1 className='text-2xl font-bold text-white'>D-CHAT</h1>
            <main className='max-w-[800px]  w-full rounded-lg md:p-3'>
                <div className="w-full relative p-1 h-[40px] rounded-full bg-[#23282d]">
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 left-1 h-[80%] w-1/2 rounded-full bg-[#051222] transition-all duration-500 ease-in-out`}
                        style={{ left: isSignIn ? "2%" : "48%" }}
                    ></div>

                
                    <div className="relative flex justify-between items-center h-full z-10">
                        <button
                            onClick={() => setIsSignIn(true)}
                            className={`w-1/2 flex justify-center items-center font-medium ${isSignIn ? "text-[#0801ad]" : "text-white"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsSignIn(false)}
                            className={`w-1/2 flex justify-center items-center font-medium ${!isSignIn ? "text-[#0801ad]" : "text-white"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                <div className='mt-4 md:mt-10'>
                    {isSignIn ? <Login /> : <SignUp />}
                </div>

            </main>
        </section>
    );
}

export default Auth;