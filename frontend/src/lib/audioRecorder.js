/**
 * A simple utility for recording audio in the browser
 */
export default class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isRecording = false;
  }

  /**
   * Request microphone access and start recording
   * @returns {Promise} Promise that resolves when recording starts
   */
  async startRecording() {
    try {
      if (this.isRecording) {
        throw new Error("Already recording");
      }
      
      // Get audio stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Start recording
      this.mediaRecorder.start();
      this.isRecording = true;
      
      return true;
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }

  /**
   * Stop recording and return the audio blob
   * @returns {Promise<Blob>} Promise that resolves with the audio blob
   */
  async stopRecording() {
    return new Promise((resolve, reject) => {
      try {
        if (!this.isRecording || !this.mediaRecorder) {
          throw new Error("Not recording");
        }
        
        this.mediaRecorder.onstop = () => {
          // Create blob from recorded chunks
          const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
          
          // Stop all tracks
          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
          }
          
          this.isRecording = false;
          this.stream = null;
          this.mediaRecorder = null;
          
          resolve(audioBlob);
        };
        
        this.mediaRecorder.stop();
      } catch (error) {
        console.error("Error stopping recording:", error);
        reject(error);
      }
    });
  }

  /**
   * Cancel recording without returning any data
   */
  cancelRecording() {
    if (this.isRecording && this.mediaRecorder) {
      this.mediaRecorder.stop();
      
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      
      this.isRecording = false;
      this.stream = null;
      this.mediaRecorder = null;
      this.audioChunks = [];
    }
  }

  /**
   * Check if browser supports audio recording
   * @returns {boolean} Whether recording is supported
   */
  static isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}
