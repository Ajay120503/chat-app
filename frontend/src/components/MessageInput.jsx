// import { useRef, useState } from "react";
// import { useChatStore } from "../store/useChatStore.js";
// import { Image, Send, X } from "lucide-react";
// import toast from "react-hot-toast";
// import imageCompression from "browser-image-compression";

// const MessageInput = () => {
//   const [text, setText] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [fileBase64, setFileBase64] = useState(null);
//   const fileInputRef = useRef(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const fileDocInputRef = useRef(null);
//   const { sendMessage } = useChatStore();

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file");
//       return;
//     }

//     try {
//       const compressedFile = await imageCompression(file, {
//         maxSizeMB: 0.05, // 50KB = 0.05MB
//         maxWidthOrHeight: 600, // Optional: you can tune this for better compression
//         useWebWorker: true,
//       });

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(compressedFile);
//     } catch (error) {
//       toast.error("Image compression failed");
//       console.error("Compression error:", error);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("File must be less than 5MB");
//       return;
//     }

//     // ❌ prevent images here (already handled)
//     if (file.type.startsWith("image/")) {
//       toast.error("Use image button for images");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFileBase64(reader.result);
//     };
//     reader.readAsDataURL(file);

//     setSelectedFile(file);
//   };

//   // const removeImage = () => {
//   //   setImagePreview(null);
//   //   if (fileInputRef.current) fileInputRef.current.value = "";
//   // };

//   const removeImage = () => {
//     setImagePreview(null);
//     setSelectedFile(null);

//     if (fileInputRef.current) fileInputRef.current.value = "";
//     if (fileDocInputRef.current) fileDocInputRef.current.value = "";
//   };

//   // const handleSendMessage = async (e) => {
//   //   e.preventDefault();
//   //   if (!text.trim() && !imagePreview) return;

//   //   try {
//   //     await sendMessage({
//   //       text: text.trim(),
//   //       image: imagePreview,
//   //     });

//   //     // Clear form
//   //     setText("");
//   //     setImagePreview(null);
//   //     if (fileInputRef.current) fileInputRef.current.value = "";
//   //   } catch (error) {
//   //     console.error("Failed to send message:", error);
//   //   }
//   // };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();

//     if (!text.trim() && !imagePreview && !fileBase64) return;

//     try {
//       await sendMessage({
//         text: text.trim(),
//         image: imagePreview,
//         file: fileBase64,
//       });

//       setText("");
//       setImagePreview(null);
//       setSelectedFile(null);
//       setFileBase64(null);

//       if (fileInputRef.current) fileInputRef.current.value = "";
//       if (fileDocInputRef.current) fileDocInputRef.current.value = "";
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     }
//   };

//   return (
//     <div className="p-4 w-full">
//       {imagePreview && (
//         <div className="mb-3 flex items-center gap-2">
//           <div className="relative">
//             {(imagePreview || selectedFile) && (
//               <div className="mb-3 flex items-center gap-2">
//                 <div className="relative">
//                   {/* IMAGE PREVIEW */}
//                   {imagePreview && (
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
//                     />
//                   )}

//                   {/* FILE PREVIEW */}
//                   {selectedFile && !imagePreview && (
//                     <div className="px-3 py-2 bg-base-200 rounded-lg text-sm">
//                       📎 {selectedFile.name}
//                     </div>
//                   )}

//                   <button
//                     onClick={removeImage}
//                     className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
//                     type="button"
//                   >
//                     <X className="size-3" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSendMessage} className="flex items-center gap-2">
//         <div className="flex-1 flex gap-2">
//           <input
//             type="text"
//             className="w-full input input-bordered rounded-lg input-sm sm:input-md"
//             placeholder="Type a message..."
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             ref={fileInputRef}
//             onChange={handleImageChange}
//           />

//           <button
//             type="button"
//             className={`hidden sm:flex btn btn-circle
//                      ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <Image size={20} />
//           </button>

//           <input
//             type="file"
//             className="hidden"
//             ref={fileDocInputRef}
//             onChange={handleFileChange}
//           />

//           <button
//             type="button"
//             className="hidden sm:flex btn btn-circle text-zinc-400"
//             onClick={() => fileDocInputRef.current?.click()}
//           >
//             📎
//           </button>
//         </div>
//         <button
//           type="submit"
//           className="btn btn-sm btn-circle"
//           // disabled={!text.trim() && !imagePreview}
//           disabled={!text.trim() && !imagePreview && !selectedFile}
//         >
//           <Send size={22} />
//         </button>
//       </form>
//     </div>
//   );
// };
// export default MessageInput;

import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { Image, Send, X, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const fileDocInputRef = useRef(null);

  const { sendMessage } = useChatStore();

  // ✅ IMAGE HANDLER
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image");
      return;
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setSelectedFile(null); // reset file if image selected
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast.error("Image compression failed");
    }
  };

  // ✅ FILE HANDLER
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }

    if (file.type.startsWith("image/")) {
      toast.error("Use image button for images");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFileBase64(reader.result);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
    setImagePreview(null); // reset image if file selected
  };

  // ✅ REMOVE PREVIEW
  const removePreview = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setFileBase64(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (fileDocInputRef.current) fileDocInputRef.current.value = "";
  };

  // ✅ SEND MESSAGE
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview && !fileBase64) return;

    try {
      setIsSending(true);

      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        file: fileBase64,
      });

      // reset
      setText("");
      setImagePreview(null);
      setSelectedFile(null);
      setFileBase64(null);

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (fileDocInputRef.current) fileDocInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      toast.error("Send failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 w-full border-t border-base-300">
      {/* ✅ PREVIEW SECTION */}
      {(imagePreview || selectedFile) && (
        <div className="mb-3 flex items-center gap-3 bg-base-200 p-2 rounded-lg w-fit relative">
          {/* IMAGE */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-20 h-20 object-cover rounded-md"
            />
          )}

          {/* FILE */}
          {selectedFile && !imagePreview && (
            <div className="flex items-center gap-2">
              <FileText className="text-blue-500" size={20} />
              <span className="text-sm max-w-[150px] truncate">
                {selectedFile.name}
              </span>
            </div>
          )}

          {/* REMOVE BUTTON */}
          <button
            onClick={removePreview}
            className="absolute -top-2 -right-2 bg-base-300 rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ✅ INPUT */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* IMAGE INPUT */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className="btn btn-circle text-zinc-400"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </button>

        {/* FILE INPUT */}
        <input
          type="file"
          hidden
          ref={fileDocInputRef}
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="btn btn-circle text-zinc-400"
          onClick={() => fileDocInputRef.current?.click()}
        >
          <FileText size={20} />
        </button>

        {/* SEND BUTTON */}
        <button
          type="submit"
          className="btn btn-circle btn-primary"
          disabled={isSending || (!text.trim() && !imagePreview && !fileBase64)}
        >
          {isSending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
