import { VertexAI } from "@google-cloud/vertexai";
import AuraChat from "../models/auraChat.model.js";
import AuraMessage from "../models/auraMessage.model.js";
import { config } from "dotenv";

config();

// Function to create a new chat with an initial message
export const createChat = async (req, res) => {
  try {
    const { message, imageUrl, audioUrl } = req.body;
    const userId = req.user._id;
    
    // Create title from message or default
    let title = "Aura Chat";
    if (message) {
      title = message.slice(0, 30) + (message.length > 30 ? "..." : "");
    } else if (audioUrl) {
      title = "Voice message";
    } else if (imageUrl) {
      title = "Image analysis";
    }
    
    // Create new chat
    const newChat = new AuraChat({
      userId,
      title
    });
    
    await newChat.save();
    
    // Create user message
    const userMessage = new AuraMessage({
      chatId: newChat._id,
      role: "user",
      parts: [{
        text: message || "",
        img: imageUrl || null,
        audio: audioUrl || null
      }]
    });
    
    await userMessage.save();
    
    // Generate AI response
    let aiResponse;
    
    // If there's a message to respond to
    if (message || imageUrl) {
      // Process with AI (implementation depends on your AI service)
      const aiText = await processWithAI(message, imageUrl);
      
      // Create AI message
      aiResponse = new AuraMessage({
        chatId: newChat._id,
        role: "model",
        parts: [{
          text: aiText
        }]
      });
      
      await aiResponse.save();
    } else if (audioUrl) {
      // For voice messages, simple acknowledgment
      aiResponse = new AuraMessage({
        chatId: newChat._id,
        role: "model",
        parts: [{
          text: "I received your voice message. How can I help you today?"
        }]
      });
      
      await aiResponse.save();
    }
    
    // Return the chat and messages
    const messages = await AuraMessage.find({ chatId: newChat._id }).sort({ createdAt: 1 });
    
    res.status(201).json({
      chat: newChat,
      messages
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

// Function to send a message in an existing chat
export const sendMessage = async (req, res) => {
  try {
    const { message, imageUrl, audioUrl } = req.body;
    const { id: chatId } = req.params;
    const userId = req.user._id;
    
    // Find the chat
    const chat = await AuraChat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    
    // Create user message
    const userMessage = new AuraMessage({
      chatId,
      role: "user",
      parts: [{
        text: message || "",
        img: imageUrl || null,
        audio: audioUrl || null
      }]
    });
    
    await userMessage.save();
    
    // Generate AI response based on content type
    let aiResponseText;
    
    if (message || imageUrl) {
      // Process with AI (implementation depends on your AI service)
      aiResponseText = await processWithAI(message, imageUrl);
    } else if (audioUrl) {
      // For voice messages, simple acknowledgment
      aiResponseText = "I received your voice message. How can I help you today?";
    } else {
      aiResponseText = "I'm not sure what you're trying to share. How can I assist you?";
    }
    
    // Create AI message
    const aiResponse = new AuraMessage({
      chatId,
      role: "model",
      parts: [{
        text: aiResponseText
      }]
    });
    
    await aiResponse.save();
    
    // Return the AI response
    res.status(200).json(aiResponse);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Helper function to process messages with AI
const processWithAI = async (message, imageUrl) => {
  // Implement your AI processing logic here
  // For now, return a placeholder response
  return `Thank you for your message. This is a placeholder AI response. ${
    imageUrl ? "I've received your image as well." : ""
  }`;
};

// Get all chats for the current user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await AuraChat.find({ userId }).sort({ updatedAt: -1 });
    
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error getting chats:", error);
    res.status(500).json({ error: "Failed to get chats" });
  }
};

// Get messages for a specific chat
export const getChatMessages = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const userId = req.user._id;
    
    // Find the chat
    const chat = await AuraChat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    
    // Get messages
    const messages = await AuraMessage.find({ chatId }).sort({ createdAt: 1 });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const userId = req.user._id;
    
    // Find and delete the chat
    const chat = await AuraChat.findOneAndDelete({ _id: chatId, userId });
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    
    // Delete all messages in the chat
    await AuraMessage.deleteMany({ chatId });
    
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};
