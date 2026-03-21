import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupPic: {
      type: String,
      default: "",
    },
    image: {
       type: String,
    },

    file: {
      url: { type: String },
      name: { type: String },
      type: { type: String },
      size: { type: Number },
    },
    
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;