import { useState, useEffect, useRef } from "react";
import { Mic, Square, Trash2, Send } from "lucide-react";
import AudioRecorder from "../lib/audioRecorder";
import toast from "react-hot-toast";

const VoiceRecorder = ({ onVoiceNoteReady, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  
  // Initialize recorder
  useEffect(() => {
    recorderRef.current = new AudioRecorder();
    
    // Check if recording is supported
    if (!AudioRecorder.isSupported()) {
      toast.error("Voice recording is not supported in your browser");
    }
    
    return () => {
      // Clean up on unmount
      if (recorderRef.current?.isRecording) {
        recorderRef.current.cancelRecording();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);
  
  // Format the time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      await recorderRef.current.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          // Limit to 5 minutes
          if (prev >= 300) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Could not start recording. Check microphone permissions.");
    }
  };
  
  // Stop recording
  const stopRecording = async () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const blob = await recorderRef.current.stopRecording();
      setIsRecording(false);
      
      // Don't save recordings shorter than 1 second
      if (recordingTime < 1) {
        toast.error("Recording too short");
        return;
      }
      
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
    } catch (error) {
      toast.error("Error while stopping recording");
    }
  };
  
  // Cancel the recording
  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (recorderRef.current?.isRecording) {
      recorderRef.current.cancelRecording();
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setIsRecording(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    
    if (onCancel) onCancel();
  };
  
  // Send the recorded audio
  const sendVoiceNote = () => {
    if (audioBlob && onVoiceNoteReady) {
      onVoiceNoteReady(audioBlob);
      // Clean up after sending
      setAudioBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
  };

  return (
    <div className="voice-recorder flex items-center justify-between gap-2 p-2 rounded-lg bg-base-200">
      {!isRecording && !audioBlob && (
        <button 
          onClick={startRecording} 
          className="btn btn-circle btn-sm"
          disabled={!AudioRecorder.isSupported()}
          title="Start recording"
        >
          <Mic size={18} className="text-primary" />
        </button>
      )}
      
      {isRecording && (
        <>
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-sm">{formatTime(recordingTime)}</span>
            <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={stopRecording}
              className="btn btn-circle btn-sm btn-error"
              title="Stop recording"
            >
              <Square size={16} />
            </button>
            
            <button 
              onClick={cancelRecording}
              className="btn btn-circle btn-sm"
              title="Cancel recording"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}
      
      {audioBlob && !isRecording && (
        <>
          <audio src={audioUrl} controls className="h-8 w-32" />
          
          <div className="flex gap-2">
            <button
              onClick={sendVoiceNote}
              className="btn btn-circle btn-sm btn-primary"
              title="Send voice note"
            >
              <Send size={16} />
            </button>
            
            <button
              onClick={cancelRecording}
              className="btn btn-circle btn-sm"
              title="Cancel"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VoiceRecorder;
