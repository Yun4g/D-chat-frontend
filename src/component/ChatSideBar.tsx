import React from 'react';
import { MdChat, MdNotifications, MdPersonAdd, } from 'react-icons/md';
import ChatRequest from './chatRequest';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setActiveTab } from '@/store/slice/activeTabsSlice';
import FindFriends from './findFriends';
import Notification from './notification';
import FriendRequest from './FriendRequest';


function ChatSideBar() {
    const dispatch = useDispatch();
    const activeTabs = useSelector((state: RootState) => state.activeTab.activeTab);

    const user = useSelector((state: RootState) => state.user);

    const tabs = [
        { name: 'chats', icon: <MdChat className='text-white' size={20} /> },
        { name: 'friend request', icon: <MdPersonAdd className='text-white' size={20} /> },

    ];
    const notificationData = useSelector((state: RootState) => state.notification.notifications)
    console.log(notificationData, ' notifiationData')
    const DisplayContent = () => {
        switch (activeTabs) {
            case 'chats':
                return <ChatRequest />;
            case 'notifications':
                return <Notification />;
            case 'friend request':
                return <FriendRequest  />;
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
        <aside aria-label="Sidebar" className="w-full h-full max-h-screen overflow-y-scroll no-scrollbar   text-white">
            <div className="p-2 flex justify-between items-center border-b border-gray-700">

                <div className="flex items-center gap-2">
                    <img
                        className="h-10 w-10 rounded-full"
                        src={user?.avatarUrl}
                        alt="avatar"
                    />
                    <div className="flex flex-col">
                        <span className="text-blue-200 font-semibold text-sm">
                            {user?.userName}
                        </span>
                        <span className="text-gray-400 text-xs">{user?.email}</span>
                    </div>
                </div>


                <div className="flex items-center pb-2 gap-2">

                    <button
                        onClick={() => dispatch(setActiveTab('notifications'))}
                        className="relative p-2 rounded-md hover:bg-gray-700"
                    >
                        <MdNotifications size={20} />
                        {notificationData.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {notificationData.length}
                            </span>
                        )}
                    </button>


                    <button
                        onClick={() => dispatch(setActiveTab('Find Friends'))}
                        className="p-2 rounded-md hover:bg-gray-700"
                    >
                        <MdPersonAdd size={20} />
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
