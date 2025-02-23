import { useState, useRef, useEffect } from "react";
import React from "react";
import "./AddEntry.css";
import mic from "../assets/mic.png";
import chicken from "../assets/chicken.png";
import {
  sendMessageToChatbot,
  analyzeMood,
  saveDiaryEntry,
  getDiaryEntryForDate,
  transcribeAudio,
} from "../utils/api";

function AddEntry() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [conversation, setConversation] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const animationRef = useRef(null);
  const [volume, setVolume] = useState(0);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const today = getTodayKey();
    const existingEntry = getDiaryEntryForDate(today);
    if (existingEntry && existingEntry.conversation) {
      setConversation(existingEntry.conversation);
    }
    setStarted(false);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const getTodayKey = () => {
    return new Date().toISOString().split("T")[0];
  };

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
    mediaRecorder.onstop = handleRecordingStop;

    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleRecordingStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    setWaitingForResponse(true);


    // Upload audio and transcribe with AssemblyAI
    const userText = await convertAudioToText(audioBlob);
    const updatedConversation = [
      ...conversation,
      { sender: "user", text: userText },
    ];
    const chatResponse = await sendMessageToChatbot(updatedConversation);
    setStarted(true);
    console.log(chatResponse);
    const newConversation = [
      ...updatedConversation,
      { sender: "bot", text: chatResponse },
    ];
    setWaitingForResponse(false);
    setConversation(newConversation);
    audioChunksRef.current = [];
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    cancelAnimationFrame(animationRef.current);
    setVolume(0);
  };

  const finishEntry = async () => {
    const diaryText = await sendMessageToChatbot([
      ...conversation,
      {
        sender: "user",
        text: "Please generate a diary entry based on our conversation",
      },
    ]);
    const mood = await analyzeMood(conversation.map((m) => m.text).join("\n"));
    const analysisText = await sendMessageToChatbot([
      ...conversation,
      {
        sender: "user",
        text: "Extract sleep time and physical health information from our conversation",
      },
    ]);
    const { sleepTime, physicalHealth } = parseAnalysis(analysisText);

    const entryData = {
      conversation,
      diary: diaryText,
      mood,
      sleepTime,
      physicalHealth,
    };
    console.log(entryData);

    saveDiaryEntry(getTodayKey(), entryData);
    setConversation([]);
    setAudioUrl(null);
  };

  const convertAudioToText = async (audioBlob) => {
    // Upload audio to backend and get a URL
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    const uploadResponse = await fetch("http://localhost:4001/upload-audio", {
      method: "POST",
      body: formData,
    });
    const { audioUrl } = await uploadResponse.json();
    console.log(audioUrl);

    // Transcribe using AssemblyAI
    const transcribedText = await transcribeAudio(audioUrl);
    console.log(transcribedText);
    return transcribedText;
  };

  const parseAnalysis = (text) => {
    const sleepMatch = text.match(/sleep time:?\s*(\d+\.?\d*)/i);
    const healthMatch = text.match(/physical health:?\s*([^\n]+)/i);
    return {
      sleepTime: sleepMatch ? parseFloat(sleepMatch[1]) : null,
      physicalHealth: healthMatch ? healthMatch[1].trim() : null,
    };
  };

  return React.createElement(
    "div",
    { className: "page-container" },
    React.createElement(
      "div",
      { className: "add-entry" },
      React.createElement(
        "div",
        { className: "chicken-container" },
        React.createElement("img", {
          src: chicken,
          alt: "Chicken",
          className: "chicken-image",
        }),
        
          React.createElement(
            "div",
            { className: "text-output-box" },
            waitingForResponse
              ? "Thinking..."
              : started
              ? conversation[conversation.length - 1].text.slice(5)
              : "Press the mic to speak to me!"
          )
      ),
      React.createElement(
        "button",
        {
          className: `mic-button ${isRecording ? "recording" : ""}`,
          style: { transform: `scale(${1 + volume / 200})` },
          onClick: isRecording ? stopRecording : startRecording,
        },
        React.createElement("img", { src: mic, alt: "Microphone" })
      ),
      started &&
        React.createElement(
          "div",
          { className: "finish-entry-container" },
          React.createElement(
            "button",
            { onClick: finishEntry, className: "finish-entry-button" },
            "finish entry"
          )
        )
    )
  );
}

export default AddEntry;
