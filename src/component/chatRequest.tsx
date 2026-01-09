import { FriendsType, useChat } from "@/hooks/useChat";
import React, { useEffect, useState } from "react";
import {
    MdSearch,
    MdErrorOutline,
    MdPersonOff,
    MdPersonAdd,
} from "react-icons/md";
import LoadingSkeleton from "./loadingSkeleton";
import { useDispatch, } from "react-redux";
import { openChat } from "@/store/slice/uiSlice";
import { setSelectedUser } from "@/store/slice/selectedUserSlice";

function ChatRequest() {
    const userId = localStorage.getItem('userId');
    console.log("UserID in ChatRequest:", userId);
    const dispatch = useDispatch();

    const { friends, loading, error, getFriends } = useChat();
    const [search, setSearch] = useState<string>("")

    useEffect(() => {
        if (userId) {
            getFriends(userId);
        }
    }, [userId]);



    const handleOpenChat = (user: FriendsType) => {
        dispatch(openChat());
        dispatch(setSelectedUser({
            _id: user.user?._id,
            userName: user.user?.userName,
            avatarUrl: user.user?.avatarUrl,
            roomId: user?.roomId,
        }))
    };

    console.log("friends", friends)
    const filteredDisplay = friends.filter(friend =>
        friend.user?.userName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>

            <div className="px-3 mt-2">
                <div className="relative">
                    <MdSearch
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search chats"
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>
            </div>


            <div className="mt-4">

                {loading && <LoadingSkeleton />}

                {!loading && error && (
                    <div className="flex flex-col items-center text-red-400 mt-6">
                        <MdErrorOutline size={40} />
                        <p className="mt-2 text-sm">
                            Failed to load friends
                        </p>
                    </div>
                )}

                {!loading && !error && friends.length === 0 && (
                    <div className="flex flex-col items-center justify-center  h-[70vh] text-gray-400 mt-6">
                        <MdPersonOff size={40} />
                        <p className="mt-2 text-sm text-white">
                            No friends yet
                        </p>
                        <button className='flex items-center text-white gap-2 mt-3 bg-blue-600 hover:bg-blue-700 transition px-3 py-2 rounded-md text-sm font-medium'>
                            Find Friends
                            <MdPersonAdd size={24} className='text-white' />
                        </button>
                    </div>
                )}

                {!loading && !error && friends.length > 0 && (
                    <div
                        className="px-3 space-y-2">
                        {filteredDisplay.map((friend) => (
                            <div
                                onClick={() => handleOpenChat(friend)}
                                key={friend._id}
                                className="p-2 rounded-lg bg-gray-800 cursor-pointer hover:bg-gray-700 flex  gap-3 items-center transition"
                            >
                                <div className="h-10 w-10 rounded-full overflow-hidden">
                                    <img src={friend.user?.avatarUrl} className="h-full w-full object-cover" alt="" />
                                </div>
                                <p>
                                    {friend.user?.userName}
                                    <span>
                                        {/* this where the message will show like whatsapp */}
                                    </span>
                                </p>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatRequest;
