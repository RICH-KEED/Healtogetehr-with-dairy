import mongoose from "mongoose";

const auraMessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuraChat",
    required: true
  },
  role: {
    type: String,
    enum: ["user", "model"],
    required: true
  },
  parts: [
    {
      text: {
        type: String,
        default: ""
      },
      img: {
        type: String,
        default: null
      },
      audio: {
        type: String,
        default: null
      }
    }
  ]
}, { timestamps: true });

const AuraMessage = mongoose.model("AuraMessage", auraMessageSchema);

export default AuraMessage;
