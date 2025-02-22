import { useState, useRef, useEffect } from "react";
import "./AddEntry.css";
import mic from "../assets/mic.png";
import chicken from "../assets/chicken.png"; // Your chicken image path

function AddEntry() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [textOutput, setTextOutput] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const animationRef = useRef(null);

  const [volume, setVolume] = useState(0);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      const average =
        dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
      setVolume(average);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      audioChunksRef.current = [];

      // After recording, set some text in the text box (example output)
      setTextOutput("This is the recorded text output.");
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    cancelAnimationFrame(animationRef.current);
    setVolume(0);
  };

  return (
    <div className="add-entry">
      <div className="chicken-container">
        <img src={chicken} alt="Chicken" className="chicken-image" />
        {audioUrl && <div className="text-output-box">{textOutput}</div>}
      </div>

      <button
        className={`mic-button ${isRecording ? "recording" : ""}`}
        style={{ transform: `scale(${1 + volume / 200})` }}
        onClick={isRecording ? stopRecording : startRecording}
      >
        <img src={mic} alt="Microphone" />
      </button>
    </div>
  );
}

export default AddEntry;
