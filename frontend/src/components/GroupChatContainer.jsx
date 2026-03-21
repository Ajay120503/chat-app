import { useEffect, useRef } from "react";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import AddMembersModal from "./AddMembersModal.jsx";

import GroupMessageInput from "./GroupMessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { formatMessageTime } from "../lib/utils.js";

const GroupChatContainer = () => {
  const { selectedGroup, groupMessages, getGroupMessages, isMessagesLoading } =
    useGroupStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedGroup) return;

    getGroupMessages(selectedGroup._id);

    const socket = useAuthStore.getState().socket;
    socket?.emit("joinGroup", selectedGroup._id);
  }, [selectedGroup, getGroupMessages]);

  useEffect(() => {
    if (messageEndRef.current && groupMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  if (!selectedGroup) return null;

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col h-full">
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* GROUP HEADER */}
      <div className="p-3 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full">
              <img src="/avatar.png" alt="group" />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedGroup.name}</h3>
            <p className="text-xs text-zinc-400">Group chat</p>
          </div>
        </div>

        <AddMembersModal groupId={selectedGroup._id} />
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupMessages?.map((message) => {
          const isSender =
            message.senderId?._id === authUser._id ||
            message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isSender
                        ? authUser.profilePic || "/avatar.png"
                        : message.senderId?.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>

              {/* Header */}
              <div className="chat-header mb-1">
                {!isSender && (
                  <span className="text-xs font-medium mr-1">
                    {message.senderId?.fullName || "User"}
                  </span>
                )}

                <time className="text-xs opacity-50">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Bubble */}
              {/* <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}

                {message.text && <p>{message.text}</p>}
              </div> */}
              <div className="chat-bubble flex flex-col">
                {/* IMAGE */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}

                {/* FILE */}
                {message.file?.url && (
                  <div className="mb-2">
                    {/* IF FILE IS IMAGE */}
                    {["jpg", "jpeg", "png", "webp"].includes(
                      message.file.type
                    ) ? (
                      <img
                        src={message.file.url}
                        alt="file"
                        className="sm:max-w-[200px] rounded-md"
                      />
                    ) : (
                      <a
                        href={message.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-base-200 hover:bg-base-300 transition p-3 rounded-xl max-w-[250px]"
                      >
                        <div className="text-2xl">📄</div>

                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium truncate">
                            {message.file.name || "File"}
                          </span>
                          <span className="text-xs opacity-60">
                            {message.file.type?.toUpperCase()}
                          </span>
                        </div>
                      </a>
                    )}
                  </div>
                )}

                {/* TEXT */}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <GroupMessageInput />
    </div>
  );
};

export default GroupChatContainer;
