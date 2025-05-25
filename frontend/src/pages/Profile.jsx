import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Camera, Mail, User } from "lucide-react";
import imageCompression from "browser-image-compression";


    const Profile = () => {
      const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
      const [selectedImg, setSelectedImg] = useState(null);

      const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // Compress image
        const options = {
          maxSizeMB: 0.05, // 0.05 MB = 50 KB
          maxWidthOrHeight: 500, // Resize if needed
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // Convert compressed file to base64
        const base64Image = await convertToBase64(compressedFile);
        setSelectedImg(base64Image);

        // Send to backend
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        console.error("Image upload error:", error);
      }
    };

    // Helper to convert to base64
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
    };


  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-300 rounded-xl p-6 sm:p-8 space-y-10 shadow-md">
          {/* Heading */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-sm text-base-content/60">Your profile information</p>
          </div>

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-base-200"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0
                  bg-base-content p-2 rounded-full cursor-pointer
                  transition-all duration-200 hover:scale-105
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-4 h-4 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/60">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Info Fields */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-base-content/60 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border text-base">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-base-content/60 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border text-base">{authUser?.email}</p>
            </div>
          </div>

          {/* Account Info Box */}
          <div className="bg-base-200 rounded-xl p-6 mt-4">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-content/20">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
