import ChatSideBar from "@/component/ChatSideBar";
import { useNotifications } from "@/hooks/useNotification";
import React from "react";
import Message from "./message";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function ChatDashboard() {
    const { getNotifications } = useNotifications();
    const isChatOpen = useSelector( (state: RootState) => state.UiSlice.isChatOpen);

    React.useEffect(() => {
        getNotifications();
    }, []);

    return (
        <section className="flex  h-full min-h-screen w-full  overflow-x-hidden">
            <div className={`w-full lg:w-[25%] border-r border-gray-600 ${isChatOpen ? "hidden lg:block" : "block"}`}>
                <ChatSideBar />
            </div>
            <div  className={`w-full lg:w-[75%] ${isChatOpen ? "block" : "hidden lg:flex"}`}>
                <Message />
            </div>
        </section>
    );
}

export default ChatDashboard;
