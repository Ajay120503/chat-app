import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, X } from "lucide-react";

const CreateGroupModal = () => {
  const { users } = useChatStore();
  const { createGroup } = useGroupStore();
  const { onlineUsers } = useAuthStore();

  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [open, setOpen] = useState(false);

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleCreate = () => {
    if (!groupName || selectedMembers.length === 0) return;

    createGroup({
      name: groupName,
      members: selectedMembers,
    });

    setGroupName("");
    setSelectedMembers([]);
    setOpen(false);
  };

  return (
    <>
      {/* CREATE GROUP BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="btn btn-ghost btn-circle btn-sm gap-2"
      >
        <Users size={18} />
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg w-[420px] max-h-[80vh] shadow-xl flex flex-col">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <h2 className="font-semibold text-lg">Create Group</h2>

              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* GROUP NAME */}
            <div className="p-4 border-b border-base-300">
              <input
                type="text"
                placeholder="Group name"
                className="input input-bordered w-full"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            {/* USERS LIST */}
            <div className="overflow-y-auto flex-1">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleMember(user._id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-base-200
                  ${selectedMembers.includes(user._id) ? "bg-base-200" : ""}`}
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      className="size-12 rounded-full object-cover"
                    />

                    {onlineUsers.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">{user.fullName}</div>

                    <div className="text-sm text-zinc-400">
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    readOnly
                    className="checkbox"
                  />
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-base-300">
              <button onClick={handleCreate} className="btn btn-ghost w-full">
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateGroupModal;
