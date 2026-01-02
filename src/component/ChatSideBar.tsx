import React from 'react';
import { MdChat, MdNotifications, MdPersonAdd, } from 'react-icons/md';
import ChatRequest from './chatRequest';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setActiveTab } from '@/store/slice/activeTabsSlice';
import FindFriends from './findFriends';
import Notification from './notification';


function ChatSideBar() {
    const dispatch = useDispatch();
    const activeTabs = useSelector((state: RootState) => state.activeTab.activeTab);

    const user = useSelector((state: RootState) => state.user);

    const tabs = [
        { name: 'chats', icon: <MdChat className='text-white' size={20} /> },
        { name: 'friend request', icon: <MdPersonAdd className='text-white' size={20} /> },

    ];
    const notificationData = useSelector((state : RootState)=> state.Notification.notifications)
     console.log(notificationData, ' notifiationData')
    const DisplayContent = () => {
        switch (activeTabs) {
            case 'chats':
                return <ChatRequest />;
            case 'notifications':
                return <Notification/>;
            case 'friend request':
                return <div>Friend Requests Content</div>;
            case 'Find Friends':
                return <FindFriends />;      
            default:
                return null;
        }
    };



    const handleTabClick = (tabName: string) => {
        dispatch(setActiveTab(tabName));
    }

    console.log(user?.avatarUrl, "Avatar URL in ChatSideBar");

    
    return (
        <aside aria-label="Sidebar" className="w-full min-h-screen text-white">
            <div className='p-2 flex justify-between h-full items-center cursor-pointer  gap-2'>
                <div className='p-2 flex flex-col  cursor-pointer  gap-2'>
                    <div className=' flex items-center cursor-pointer  gap-2'>
                        <img className='h-10 w-10 rounded-full' src={user?.avatarUrl} alt="" />
                        <h1 className='text-blue-200 font-semibold text-lg'>{user?.userName}</h1> <br />
                    </div>

                    <span className='text-gray-300 text-sm'>{user?.email}</span>
                </div>

                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => dispatch(setActiveTab('notifications'))}
                        className={` ${activeTabs == 'notifications' ? 'bg-blue-600 hover:bg-blue-700 ' : 'bg-transparent'} px-2 flex items-center gap-2  transition relative  py-1 rounded-md text-sm font-medium`}>
                        <MdNotifications size={24} className='text-white' />
                        <span className='absolute text-blue-600 top-0 right-0'>{notificationData.length > 0 && notificationData.length}</span>
                    </button>
                    <button
                        onClick={() => dispatch(setActiveTab('Find Friends'))}
                        className={` ${activeTabs == 'Find Friends' ? 'bg-blue-600 hover:bg-blue-700 ' : 'bg-transparent'} flex items-center gap-2 transition px-3 py-1 rounded-md text-sm font-medium`}>
                        <MdPersonAdd size={24} className='text-white' />
                    </button>
                </div>
            </div>

  
            <div className="overflow-y-hidden border-b border-gray-600 py-4 px-3">
                <div className="flex items-center gap-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => handleTabClick(tab.name)}
                            className={`flex items-center p-2 rounded-lg transition ${activeTabs === tab.name
                                ? 'bg-gray-500'
                                : 'hover:bg-gray-800'
                                }`}
                        >
                            {tab.icon}
                            <span className=" ml-1 text-sm font-bold">{tab.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className='my-6'>
                {DisplayContent()}
            </div>
        </aside>
    );
}

export default ChatSideBar;
