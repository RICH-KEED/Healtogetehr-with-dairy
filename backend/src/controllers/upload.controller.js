import { v4 as uuidv4 } from 'uuid';
import cloudinary from "../lib/cloudinary.js";
import ImageKit from "imagekit";

// Initialize ImageKit with environment variables
const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
});

export const getImageKitAuthParams = async (req, res) => {
  try {
    // Generate authentication parameters for client-side uploads
    const authParams = imagekit.getAuthenticationParameters();
    res.json(authParams);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    res.status(500).json({ message: "Failed to generate auth tokens" });
  }
};

export const uploadAudio = async (req, res) => {
  try {
    const { audio } = req.body;
    
    if (!audio) {
      return res.status(400).json({ message: "No audio data provided" });
    }
    
    // Upload audio file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(audio, {
      resource_type: "auto",
      folder: "voice_notes",
      format: "mp3", // Convert to mp3 for wider compatibility
      public_id: `voice-note-${uuidv4().slice(0, 8)}`,
      overwrite: true,
    });
    
    res.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Audio upload error:", error);
    res.status(500).json({ message: "Failed to upload audio file" });
  }
};
