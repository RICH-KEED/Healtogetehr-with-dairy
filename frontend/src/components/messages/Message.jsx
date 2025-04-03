import { useAuthStore } from "../../store/useAuthStore";
import { timeFromNow } from "../../utils/dateUtils";
import { useState, useEffect } from "react";
// Import from components index
import { AudioPlayer } from "../../components";

const Message = ({ message }) => {
  const { authUser } = useAuthStore();
  const isMyMessage = message.senderId === authUser._id;
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const hasImage = message.image && message.image.length > 0;
  const hasAudio = message.audio && message.audio.length > 0;
  
  // Log for debugging
  useEffect(() => {
    if (hasAudio) {
      console.log("Audio message detected:", message.audio);
    }
  }, [message, hasAudio]);

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] rounded-lg p-3 ${
          isMyMessage 
            ? "bg-primary text-primary-content" 
            : "bg-base-200 text-base-content"
        }`}
      >
        {/* Display image if present */}
        {hasImage && (
          <div className={`mb-2 ${imageLoaded ? "" : "animate-pulse bg-gray-300 rounded-md h-32"}`}>
            <img
              src={message.image}
              alt="Message attachment"
              className="rounded-md max-h-60 object-contain"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}

        {/* Display audio if present */}
        {hasAudio && (
          <div className="mb-2">
            <AudioPlayer src={message.audio} />
          </div>
        )}

        {/* Display text if present */}
        {message.text && (
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        )}
        
        <span className="text-xs opacity-70 mt-1 block text-right">
          {timeFromNow(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default Message;
