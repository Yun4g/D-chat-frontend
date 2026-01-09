import { closeChat } from "@/store/slice/uiSlice";
import { RootState } from "@/store/store";
import React, { useRef, useState, useEffect, } from "react";
import { MdArrowBack, MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { socket } from "@/lib/socket";



interface ChatMessage {
    _id: string;
    message: string;
    senderId: string;
    roomId: string;
    createdAt: string | Date;
    pending?: boolean;
}

function Message() {
    const selectedUser = useSelector((state: RootState) => state.selectedUser.selectedUser);
    const User = useSelector((state: RootState) => state.user.userId);
    console.log(User, 'usrOId')
    console.log('selectedUser', selectedUser);
    const dispatch = useDispatch();




    const [message, setMessage] = useState<string>("");
    const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
    console.log(displayMessages, 'displayMessage')
    const [showEmoji, setShowEmoji] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    console.log(cursorPosition)

    const inputRef = useRef<HTMLInputElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);


    const updateCursor = () => {
        if (inputRef.current) {
            setCursorPosition(inputRef.current.selectionStart ?? 0);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = inputRef.current.scrollHeight + "px";
        }
    }, [message]);

    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            console.log("Received message:", data);
            setDisplayMessages((prev) => [...prev, data]);
        });

        socket.on("loadMessages", (messages) => {
            setDisplayMessages(messages);
        });


        return () => {
            socket.off("receiveMessage");
            socket.off("loadMessages");
        };
    }, []);





    useEffect(() => {
        console.log(displayMessages, 'displayMessages updated');
    }, [displayMessages]);

    const handleEmojiClick = (emojiData: EmojiClickData) => {

        const currentPosition = inputRef.current?.selectionStart ?? 0;

        setMessage((prevMessage) => {
            const start = prevMessage.substring(0, currentPosition);
            const end = prevMessage.substring(currentPosition);
            return start + emojiData.emoji + end;
        });


        const newPos = currentPosition + emojiData.emoji.length;

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(newPos, newPos);
            }
            setCursorPosition(newPos);
        }, 0);
    };

    useEffect(() => {
        if (!selectedUser) return;
        socket.emit("joinRoom", selectedUser.roomId, () => {
            console.log(`Joined room: ${selectedUser.roomId}`);
        });

        socket.emit("getMessages", selectedUser.roomId);
    }, [selectedUser]);



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                emojiRef.current &&
                !emojiRef.current.contains(event.target as Node)
            ) {
                const isToggleButton = (event.target as HTMLElement).closest(".emoji-toggle-btn");
                if (!isToggleButton) {
                    setShowEmoji(false);
                }
            }
        };

        if (showEmoji) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showEmoji]);

    if (!selectedUser) {
        return (
            <div className="hidden md:flex h-full w-full items-center justify-center text-gray-400">
                Select a chat to start messaging
            </div>
        );
    }


    const handleSendMessage = () => {
        socket.emit("sendMessage", {
            roomId: selectedUser.roomId,
            message: message,
            senderId: User
        })

        setMessage("")



    }




    return (
        <section className="flex flex-col h-full w-full max-h-screen text-white bg-[#051222]">

            <header className="flex p-4 border-b border-gray-600 justify-between items-center bg-[#071624]">
                <div className="flex items-center gap-3">
                    <div
                        onClick={() => dispatch(closeChat())}
                        className="lg:hidden cursor-pointer p-1 hover:bg-gray-700 rounded-full"
                    >
                        <MdArrowBack className="text-2xl text-[#bfc3ea]" />
                    </div>
                    <img
                        src={selectedUser.avatarUrl}
                        className="border border-gray-500 w-10 h-10 rounded-full object-cover"
                        alt={selectedUser.userName}
                    />
                    <div>
                        <p className="font-semibold text-white">{selectedUser.userName}</p>
                        <span className="text-xs text-green-400">online</span>
                    </div>
                </div>
            </header>


            <div className="flex-1 overflow-y-auto bg-[#051222]  md:p-4">


                <div className="flex-1  justify-end  h-full overflow-y-auto no-scrollbar  p-4 space-y-2">
                    {displayMessages.map((msg, index) =>
                    (
                        <div

                            key={index}
                            className={`w-fit text-xs md:text-base flex justify-between gap-3  px-3 py-2 rounded-lg 
                                ${msg.senderId === User ? "ml-auto bg-[#09305e]  " : "mr-auto bg-gray-700 mt-auto"
                                }`}
                        >
                            {msg.message}

                            <span className="text-sm mt-3">
                                {new Date(msg.createdAt).toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>

                        </div>
                    ))}
                </div>

            </div>


            <footer className="border-t border-gray-700 bg-[#1e1e1e]">
                <div className="flex items-center gap-2 px-3 py-2 max-w-6xl mx-auto w-full relative">

                    <div className="relative flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => setShowEmoji(!showEmoji)}
                            className="emoji-toggle-btn p-2 rounded-full hover:bg-gray-700 bg-gray-600 transition"
                        >
                            😊
                        </button>

                        {showEmoji && (
                            <div ref={emojiRef} className="absolute bottom-14 left-0 z-50 shadow-2xl">
                                <EmojiPicker
                                    theme={Theme.DARK}
                                    onEmojiClick={handleEmojiClick}
                                    autoFocusSearch={false}
                                />
                            </div>
                        )}
                    </div>


                    <textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            setCursorPosition(e.target.selectionStart ?? 0);
                        }}
                        onKeyUp={updateCursor}
                        onClick={updateCursor}
                        placeholder="Type a message..."
                        className="flex-1 min-w-0 bg-gray-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all resize-none"
                        rows={1} // initial height
                    ></textarea>


                    <button
                        type="button"
                        disabled={!message.trim()}
                        onClick={handleSendMessage}
                        className={`flex-shrink-0 p-3 rounded-full transition-all ${message.trim()
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-600 cursor-not-allowed opacity-50"
                            }`}
                    >
                        <MdSend className="text-xl text-white" />
                    </button>
                </div>
            </footer>

        </section>
    );
}

export default Message;