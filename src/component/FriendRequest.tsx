import React, { useEffect, useState } from "react";
import useGetFriendRequest from "@/hooks/useGetFriendRequest";
import useAcceptRequest from "@/hooks/useAcceptRequest";
import useRejectRequest, { RejectRequestResponse } from "@/hooks/useRejectsRequest";
import useActionModal from "@/component/useActionModal";
import LoadingSkeleton from "./loadingSkeleton";
import Modal from "./Modal";
import { MdErrorOutline, MdPersonAdd, MdPersonOff } from "react-icons/md";
import { AxiosError } from "axios";







function FriendRequest() {
  const {
    getFriendRequests,
    loading: loadingRequest,
    error,
    data,
  } = useGetFriendRequest();

  const {
    acceptRequest,
    loading: loadingAccept,
  } = useAcceptRequest();

  const {
    reJectRequest,
    loading: loadingReject,
  } = useRejectRequest();

  const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null);

  const modal = useActionModal();

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  const senderRequests = data?.senderRequest || [];





  const handleAccept = async (userId: string) => {
    console.log(userId, 'senderId');
    if (loadingButtonId) return;
    setLoadingButtonId(userId);

    try {
      const res = await acceptRequest(userId);
      if (res?.roomId) {
        modal.showSuccess(res?.message || "Request accepted successfully");
        getFriendRequests();
      } else {
        modal.showError(res?.message || "Failed to accept request");
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      modal.showError(error.response?.data?.message || "Failed to accept request");
    } finally {
      setLoadingButtonId(null);
    }
  };


  const handleReject = async (userId: string) => {
    if (loadingButtonId) return;
    setLoadingButtonId(userId);

    try {
      const res: RejectRequestResponse | undefined = await reJectRequest(userId);

      if (res?.status === "success") {
        modal.showSuccess("Request rejected successfully");
        getFriendRequests();
      } else {
        modal.showError(res?.message || "Failed to reject request");
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      modal.showError(error.response?.data?.message || "Failed to reject request");
    } finally {
      setLoadingButtonId(null);
    }
  };

  if (loadingRequest) return <LoadingSkeleton />;

  return (
    <div>

      {error && (
        <div className="flex flex-col items-center text-red-400 mt-6">
          <MdErrorOutline size={40} />
          <p className="mt-2 text-sm">Failed to load requests</p>
        </div>
      )}

      {!error && senderRequests.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
          <MdPersonOff size={40} />
          <p className="mt-2 text-sm text-white">No Requests</p>

          <button className="flex items-center gap-2 mt-3 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium text-white">
            Find Friends
            <MdPersonAdd size={22} />
          </button>
        </div>
      )}


      {senderRequests.length > 0 && (
        <section className="px-4 space-y-3">
          {senderRequests.map((req) => {
            const isLoading =
              loadingButtonId === req.userId &&
              (loadingAccept || loadingReject);

            return (
              <div
                key={req.userId}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-750 transition"
              >
                <img
                  src={req.avatarUrl}
                  alt={req.name}
                  className="h-11 w-11 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{req.name}</p>
                  <p className="text-sm text-gray-400">
                    {req.mutualFriendsCount} mutual friends
                  </p>

                  <div className="flex gap-2 mt-2">
                    <button
                      disabled={isLoading}
                      onClick={() => handleAccept(req.userId)}
                      className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-full text-sm"
                    >
                      {isLoading && loadingAccept ? "Accepting..." : "Accept"}
                    </button>

                    <button
                      disabled={isLoading}
                      onClick={() => handleReject(req.userId)}
                      className="flex-1 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:opacity-60 rounded-full text-sm"
                    >
                      {isLoading && loadingReject ? "Declining..." : "Decline"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Single Modal */}
      {modal.modalMessage && (
        <Modal
          visible
          message={modal.modalMessage}
          variant={modal.modalVariant}
          onClose={modal.closeModal}
        />
      )}
    </div>
  );
}

export default FriendRequest;
