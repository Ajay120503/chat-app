import User from "../models/user.model.js";
import Message from '../models/message.model.js';
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUSerId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUSerId }
    }).select("-password");

    res.status(200).json(filteredUsers);

  } catch (error) {
    console.error("get user sidebar error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, file } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    let fileData;

    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    if (file && file.startsWith("data:")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
          resource_type: "raw",
          folder: "chat_files",
        });

        fileData = {
          url: uploadResponse.secure_url,
          name: uploadResponse.original_filename || "file",
          type: uploadResponse.format,
          size: uploadResponse.bytes,
        };
      } catch (err) {
        console.error("File upload failed:", err);
      }
    }

    console.log("file from frontend:", file);
    console.log("fileData after upload:", fileData);
    console.log("Schema file type:", Message.schema.paths.file);

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      file: fileData,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};