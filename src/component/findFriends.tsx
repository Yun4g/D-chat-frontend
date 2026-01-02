import { useFriends } from "@/hooks/useFreinds";
import React, { useEffect, useState } from "react";
import LoadingSkeleton from "./loadingSkeleton";
import { MdError } from "react-icons/md";
import { useSendFriendRequest } from "@/hooks/useSendFriendRequest";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SlideDownModal from "./slideDownModal";

interface User {
  _id: string;
  userName: string;
  email: string;
  avatarUrl?: string;
  requestStatus: "pending" | "accepted" | "rejected"
}

function FindFriends() {
  const loggedInUserId = useSelector((state: RootState) => state.user.userId);

  const {
    getFriends,
    friends,
    loading: friendsLoading,
    error: friendsError,
  } = useFriends();

  const {
    sendRequest,
    loading: requestLoading,
    error: requestError,
    success,
  } = useSendFriendRequest();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);


  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    if (success || requestError) {

      const timer = setTimeout(() => {
        if (success) {
          setModalType("success");
          setModalMessage(success);
        } else if (requestError) {
          setModalType("error");
          setModalMessage(requestError);
        }
        setShowModal(true);

        const hideTimer = setTimeout(() => setShowModal(false), 3000);
        return () => clearTimeout(hideTimer);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [success, requestError]);


  const handleAddFriend = async (friend: User) => {
    setActiveRequestId(friend._id)
  const res =  await sendRequest({
      senderId: loggedInUserId,
      receiverId: friend._id,
      receiverEmail: friend.email,
    });
    if(res){
       getFriends();
       setActiveRequestId(null)
    }
  };

  return (
    <div className="px-3">
      <h1 className="text-xl mb-3">Suggested People</h1>

      {friendsLoading && <LoadingSkeleton />}

      {!friendsLoading && friendsError && (
        <div className="flex flex-col items-center text-red-400 mt-6">
          <MdError size={40} />
          <p className="mt-2 text-sm">Failed to load friends</p>
        </div>
      )}

      {!friendsLoading && !friendsError && friends?.requestStatus !== 'accepted' && (
        <div>
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="flex justify-between bg-white/30 rounded-lg items-center py-2 px-4 my-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={friend.avatarUrl}
                  alt={friend.userName}
                  className="w-12 h-12 rounded-full"
                />
                <p className="text-white font-semibold">{friend.userName}</p>
              </div>


              <div>
                {
                  friend.requestStatus == 'pending' ? (

                    <button
                      className="px-4 py-1 rounded-3xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                    >
                      Pending
                    </button>
                  ) : (

                    <button
                      onClick={() => handleAddFriend(friend)}
                      disabled={requestLoading}
                      className="px-4 py-1 rounded-3xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                    >
                      {requestLoading && activeRequestId === friend._id? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div>
                          Add
                        </div>

                      )}
                    </button>
                  )
                }
              </div>

            </div>
          ))}
        </div>
      )}


      <SlideDownModal
        open={showModal}
        type={modalType}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default FindFriends;
