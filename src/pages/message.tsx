import { closeChat } from "@/store/slice/uiSlice";
import { RootState } from "@/store/store";
import React, { useRef, useState, useEffect, } from "react";
import { MdArrowBack, MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { socket } from "@/lib/socket";
import { setRecentMessage } from "@/store/slice/recentMessageSlice";
import { Clipboard, ClipboardCheck,  } from "lucide-react";




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
    const User = useSelector((state: RootState) => state.user._id);
    console.log(User, 'usrOId')
    console.log('selectedUser', selectedUser);
    const dispatch = useDispatch();




    const [message, setMessage] = useState<string>("");
    const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
    console.log(displayMessages, 'displayMessage')
    const [showEmoji, setShowEmoji] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    console.log(cursorPosition);
    const [ copiedId,  setCopiedId] = useState<string | null>(null)


    const emojiRef = useRef<HTMLDivElement>(null);


    const inputRef = useRef<HTMLTextAreaElement>(null);

    // const updateCursor = () => {
    //     if (inputRef.current) {
    //         setCursorPosition(inputRef.current.selectionStart ?? 0);
    //     }
    // };



    const getLastMessage = displayMessages[displayMessages.length - 1]
    console.log(getLastMessage, "getMassage test")


    useEffect(() => {

        if (!displayMessages) {
            return;
        }

        dispatch(setRecentMessage(getLastMessage?.message))

    }, [displayMessages])

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


    const handleCopy = async(text: string, id: string)=> {
            try {
                await navigator.clipboard.writeText(text) 
                setCopiedId(id)

                setTimeout(() => {
                     setCopiedId(null)
                }, 1400);
            } catch (error) {
                 console.log(error, 'error copying text')
            }
    }





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
        console.log("message clicked")
        socket.emit("sendMessage", {
            roomId: selectedUser.roomId,
            message: message,
            senderId: User
        })

        setMessage("")
    }


    const Linkfy = ({ text }: { text?: string }) => {
        const safeText = text ?? "";
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        const parts = safeText.split(urlRegex);

        return (
            <>
                {parts.map((part, index) => {
                    if (part.match(urlRegex)) {
                        const href = part.startsWith("http")
                            ? part
                            : `https://${part}`;

                        return (
                            <a
                                key={index}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-500 break-words"
                            >
                                {part}
                            </a>
                        );
                    }
                    return <span key={index}>{part}</span>;
                })}
            </>
        );
    };







    return (
        <section className="flex flex-col h-full w-full text-white bg-[#051222]">


            <header className="flex p-4 border-b border-gray-600 justify-between items-center bg-[#071624]">
                <div className="flex items-center gap-3">
                    <div
                        onClick={() => dispatch(closeChat())}
                        className="lg:hidden cursor-pointer p-1 hover:bg-gray-700 rounded-full"
                        aria-label="Go back"
                    >
                        <MdArrowBack className="text-2xl text-[#bfc3ea]" />
                    </div>

                    <img
                        src={selectedUser.avatarUrl}
                        className="border border-gray-500 w-10 h-10 rounded-full object-cover"
                        alt={`${selectedUser.userName} avatar`}
                    />

                    <div>
                        <p className="font-semibold">{selectedUser.userName}</p>
                        <span className="text-xs text-green-400">online</span>
                    </div>
                </div>
            </header>


            <div className="flex-1 overflow-y-auto h-[70vh] p-4 space-y-2 no-scrollbar">
                {displayMessages.map((msg) => {
                    const isMine = msg.senderId === User;
                    const copied = copiedId === msg._id;

                    return (
                        <div
                            key={msg._id}
                            className={`group relative max-w-[80%] w-fit break-words whitespace-pre-wrap
                px-3 py-2 rounded-lg text-xs md:text-base
                ${isMine ? "ml-auto bg-[#09305e]" : "mr-auto bg-gray-700"}`}
                        >
                           
                            <div className="pr-3">
                                <Linkfy text={msg.message} />
                            </div>

                     
                            <div className="flex items-center justify-end gap-2 me-3">
                                <span className="text-[10px] md:text-xs opacity-60">
                                    {new Date(msg.createdAt).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>

                            <button
                                onClick={() => handleCopy(msg.message, msg._id)}
                                aria-label="Copy message"
                                className={`
                        absolute bottom-0 right-0
                        p-1 rounded-md
                        bg-black/30 backdrop-blur
                        hover:bg-black/50
                        transition
                        opacity-100 md:opacity-0 md:group-hover:opacity-100
                    `}
                            >
                                {copied ? (
                                    <ClipboardCheck size={11} className="text-green-400" />
                                ) : (
                                    <Clipboard size={12} className="text-white/80" />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>


            <footer className="border-t border-gray-700 bg-[#1e1e1e] p-2 md:p-4 flex-shrink-0">
                <div className="flex items-end gap-2 max-w-6xl mx-auto w-full">


                    <div className="relative">
                        <button
                            type="button"
                            aria-label="Open emoji picker"
                            onClick={() => setShowEmoji((p) => !p)}
                            className="p-2 rounded-full hover:bg-gray-700 bg-gray-600"
                        >
                            😊
                        </button>

                        {showEmoji && (
                            <div ref={emojiRef} className="absolute bottom-14 left-0 z-50">
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
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 max-h-36 bg-gray-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
                        rows={1}
                    />

                    <button
                        type="button"
                        aria-label="Send message"
                        disabled={!message.trim()}
                        onClick={handleSendMessage}
                        className={`p-3 rounded-full transition
                           ${message.trim()
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-600 opacity-50 cursor-not-allowed"
                            }`}
                    >
                        <MdSend className="text-xl" />
                    </button>

                </div>
            </footer>
        </section>

    );
}

export default Message;