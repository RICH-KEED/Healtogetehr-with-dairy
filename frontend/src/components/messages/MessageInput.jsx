import { useState, useRef } from "react";
import { BsSend } from "react-icons/bs";
import { Mic, Image as ImageIcon, X } from "lucide-react";
import useSendMessage from "../../hooks/useSendMessage";
import toast from "react-hot-toast";
import { VoiceRecorder } from "../../components";

const MessageInput = ({ conversationId }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const imageInputRef = useRef(null);

  // Handle image attachment
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }
    
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    try {
      // If we have an image, encode it as base64
      let imageBase64 = null;
      if (image) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(image);
        });
      }

      await sendMessage(message, conversationId, imageBase64);
      setMessage("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.log("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleVoiceNoteReady = async (audioBlob) => {
    try {
      console.log("Voice note ready, converting to base64...");
      // Convert audio blob to base64
      const reader = new FileReader();
      const audioBase64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(audioBlob);
      });

      console.log("Sending voice note...");
      await sendMessage("", conversationId, null, audioBase64);
      setShowVoiceRecorder(false);
    } catch (error) {
      console.log("Error sending voice note:", error);
      toast.error("Failed to send voice note");
    }
  };

  return (
    <div className="p-3 border-t border-gray-300">
      {showVoiceRecorder ? (
        <div className="mb-3">
          <h4 className="text-sm font-semibold mb-2">Record Voice Message</h4>
          <VoiceRecorder
            onVoiceNoteReady={handleVoiceNoteReady}
            onCancel={() => setShowVoiceRecorder(false)}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Image preview */}
          {imagePreview && (
            <div className="relative inline-block mb-2">
              <img
                src={imagePreview}
                alt="Selected"
                className="h-20 w-auto object-cover rounded-md"
              />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {/* Image upload button */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="btn btn-circle btn-sm"
              disabled={loading}
            >
              <ImageIcon size={18} />
            </button>
            
            {/* Voice recording button */}
            <button
              type="button"
              onClick={() => {
                console.log("Voice recorder button clicked");
                setShowVoiceRecorder(true);
              }}
              className="btn btn-circle btn-sm bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              <Mic size={18} className="text-white" />
            </button>

            <input
              type="file"
              className="hidden"
              ref={imageInputRef}
              onChange={handleImageChange}
              accept="image/*"
            />

            <input
              type="text"
              className="flex-1 p-2 rounded border focus:outline-none focus:border-blue-500"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className={`bg-blue-500 p-2 rounded-full text-white ${loading ? "opacity-50" : "hover:bg-blue-600"}`}
              disabled={loading || (!message.trim() && !image)}
            >
              <BsSend />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MessageInput;
