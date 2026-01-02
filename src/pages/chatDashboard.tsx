import ChatSideBar from '@/component/ChatSideBar';
import { useNotifications } from '@/hooks/useNotification';
import React from 'react';



function ChatDashboard() {
    const {getNotifications} = useNotifications();

       React.useEffect(() => {
            getNotifications();
        }, []);


    return (
        <section className='flex  h-full min-h-screen w-full '>
            <div className='md:w-[25%] border-r-[0.5px]  border-gray-600 h-full'>
                <ChatSideBar/>
            </div>
            <div className='md:w-[75%] flex justify-center items-center'>

            </div>
        </section>
    );
}

export default ChatDashboard;