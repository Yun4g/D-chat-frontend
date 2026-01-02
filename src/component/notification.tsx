import { useNotifications } from "@/hooks/useNotification";
import React, { useEffect } from "react";
import { socket } from "@/lib/socket";
import { MdNotificationsNone } from "react-icons/md";

function Notification() {


    const {
        notifications,
        loading,
        error,
        getNotifications,
        setNotifications,
    } = useNotifications();

    useEffect(() => {
    
        getNotifications();
    }, [getNotifications, ]);


    useEffect(() => {
     const userId = localStorage.getItem('userId')
     console.log('userId', userId)

     if(!userId) return;
        socket.on("notification", (data: { requestId: string; message: string }) => {
            console.log( 'notification socket', data.message)
            setNotifications((prev) => [
                {
                    _id: data.requestId,
                    userId,
                    message: data.message,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                ...prev,
            ]);
        });

        return () => {
            socket.off("notification");
        };
    }, [setNotifications]);

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MdNotificationsNone size={22} />
                Notifications
            </h2>

            {loading && (
                <p className="text-sm text-gray-400">Loading notifications...</p>
            )}

            {!loading && error && (
                <div className="flex flex-col items-center justify-center  h-[70vh] text-gray-400 mt-6">
                     <MdNotificationsNone size={49} />
                    <p className="mt-2 text-sm">
                        {error}
                    </p>

                </div>
            )}

            {!loading && !error && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center  h-[70vh] text-gray-400 mt-6">
                     <MdNotificationsNone size={40} />
                    <p className="mt-2 text-sm">
                        No notification yet
                    </p>

                </div>
            )}

            <div className="space-y-3">
                {notifications.map((notification) => (
                    <div
                        key={notification._id}
                        className="bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-sm flex items-start gap-3"
                    >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />

                        <div>
                            <p className="text-sm text-white">
                                {notification.message}
                            </p>
                            <span className="text-xs text-gray-400">
                                {new Date(notification.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notification;
