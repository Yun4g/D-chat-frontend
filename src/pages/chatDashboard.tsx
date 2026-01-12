import ChatSideBar from "@/component/ChatSideBar";
import { useNotifications } from "@/hooks/useNotification";
import React, { useEffect } from "react";
import Message from "./message";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function ChatDashboard() {
    const { getNotifications } = useNotifications();
    const isChatOpen = useSelector(
        (state: RootState) => state.UiSlice.isChatOpen
    );

    useEffect(() => {
        getNotifications();
    }, []);

    return (
        <section className="flex h-screen w-full overflow-hidden">
            <aside className={` w-full lg:w-[25%] border-r border-gray-600 overflow-y-auto no-scrollbar  ${isChatOpen ? "hidden lg:block" : "block"} `}>
                <ChatSideBar />
            </aside>

            <main className={`w-full lg:w-[75%] flex flex-col ${isChatOpen ? "block" : "hidden lg:flex"} `}>
                <Message />
            </main>
        </section>
    );
}

export default ChatDashboard;
