import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useGroupStore } from "../store/useGroupStore";

import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import CreateGroupModal from "./CreateGroupModal";

import { Users, Users2 } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  const { groups, selectedGroup, setSelectedGroup, getGroups } =
    useGroupStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, []);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">
      {/* CONTACT HEADER */}
      <div className="border-b border-base-300 p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
            />
            <span className="text-sm">Online only</span>
          </label>

          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* USERS LIST */}
      <div className="overflow-y-auto flex-1 py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setSelectedGroup(null);
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />

              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500
                  rounded-full ring-2 ring-base-100"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No users available
          </div>
        )}
      </div>

      {/* GROUP SECTION */}
      <div className="border-t border-base-300">
        {/* GROUP HEADER */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Users2 className="size-5" />
            <span className="font-medium hidden lg:block">Groups</span>
          </div>

          <CreateGroupModal />
        </div>

        {/* GROUP LIST */}
        <div className="overflow-y-auto max-h-60 pb-3">
          {groups.map((group) => (
            <button
              key={group._id}
              onClick={() => {
                setSelectedGroup(group);
                setSelectedUser(null);
              }}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedGroup?._id === group._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              {/* GROUP AVATAR */}
              <div className="avatar">
                <div className="size-10 rounded-full bg-base-200 flex items-center justify-center">
                  <span className="font-semibold">
                    {/* {group.name.charAt(0).toUpperCase()} */}
                    <img
                      src={"/avatar.png"}
                      className="size-12 object-cover rounded-full"
                    />
                  </span>
                </div>
              </div>

              {/* GROUP INFO */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{group.name}</div>

                <div className="text-xs text-zinc-400">
                  {group.members?.length || 0} members
                </div>
              </div>
            </button>
          ))}

          {groups.length === 0 && (
            <div className="text-center text-zinc-500 py-3 text-sm">
              No groups yet
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
