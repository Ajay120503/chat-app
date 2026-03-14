import Group from "../models/group.model.js";
import Message from "../models/message.model.js";
import { io } from "../lib/socket.js";


// CREATE GROUP
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    const group = new Group({
      name,
      admin: req.user._id,
      members: [...members, req.user._id],
    });

    await group.save();

    res.status(201).json(group);

  } catch (error) {
    console.log("Create group error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// GET USER GROUPS
export const getUserGroups = async (req, res) => {
  try {

    const groups = await Group.find({
      members: req.user._id
    }).populate("members", "-password");

    res.status(200).json(groups);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// GET GROUP MESSAGES
export const getGroupMessages = async (req, res) => {
  try {

    const { groupId } = req.params;

    const messages = await Message.find({
      groupId
    }).populate("senderId", "fullName profilePic");

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// SEND GROUP MESSAGE
export const sendGroupMessage = async (req, res) => {
  try {

    const { groupId } = req.params;
    const { text } = req.body;

    const message = new Message({
      senderId: req.user._id,
      groupId,
      text
    });

    await message.save();

    io.to(groupId).emit("newGroupMessage", message);

    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const addMembersToGroup = async (req, res) => {
  try {
    const { groupId, members } = req.body;

    if (!groupId || !members || members.length === 0) {
      return res.status(400).json({
        message: "GroupId and members are required",
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    // Prevent duplicate members
    const existingMembers = group.members.map((id) => id.toString());

    const newMembers = members.filter(
      (member) => !existingMembers.includes(member)
    );

    group.members.push(...newMembers);

    await group.save();

    const updatedGroup = await Group.findById(groupId).populate(
      "members",
      "fullName profilePic"
    );

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Add members error:", error);
    res.status(500).json({ message: "Server error" });
  }
};