import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    seconds = Math.floor(seconds);
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // Handle audio time update
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };
  
  // Handle audio metadata loaded
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };
  
  // Handle audio ended
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  // Handle slider change
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    setCurrentTime(seekTime);
  };
  
  return (
    <div className="audio-player flex items-center gap-2 p-1 rounded-lg bg-base-300 max-w-xs">
      <button 
        onClick={togglePlay}
        className="btn btn-circle btn-xs"
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
      </button>
      
      <div className="flex-1">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="range range-xs range-primary w-full"
          step="0.01"
        />
      </div>
      
      <div className="text-xs w-14 font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
};

export default AudioPlayer;
