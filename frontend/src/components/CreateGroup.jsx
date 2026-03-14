// import { useState } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { useGroupStore } from "../store/useGroupStore";

// const CreateGroup = () => {
//   const { users } = useChatStore();
//   const { createGroup } = useGroupStore();

//   const [groupName, setGroupName] = useState("");
//   const [selectedMembers, setSelectedMembers] = useState([]);

//   const toggleMember = (userId) => {
//     if (selectedMembers.includes(userId)) {
//       setSelectedMembers(selectedMembers.filter((id) => id !== userId));
//     } else {
//       setSelectedMembers([...selectedMembers, userId]);
//     }
//   };

//   const handleCreate = () => {
//     if (!groupName) return;

//     createGroup({
//       name: groupName,
//       members: selectedMembers,
//     });

//     setGroupName("");
//     setSelectedMembers([]);
//   };

//   return (
//     <div className="p-4 border-b">
//       <h2 className="font-bold mb-2">Create Group</h2>

//       <input
//         className="input input-bordered w-full mb-3"
//         placeholder="Group name"
//         value={groupName}
//         onChange={(e) => setGroupName(e.target.value)}
//       />

//       <div className="max-h-40 overflow-y-auto">
//         {users.map((user) => (
//           <div key={user._id} className="flex items-center gap-2">
//             <input type="checkbox" onChange={() => toggleMember(user._id)} />
//             <span>{user.fullName}</span>
//           </div>
//         ))}
//       </div>

//       <button className="btn btn-ghost btn-md mt-3" onClick={handleCreate}>
//         Create Group
//       </button>
//     </div>
//   );
// };

// export default CreateGroup;
