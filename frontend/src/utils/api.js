import axios from "axios";

// API base URL (adjust according to your setup)
const API_URL = "http://localhost:4001";

// Send the conversation history to the backend and get the chatbot's response
export const sendMessageToChatbot = async (messages) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { messages });
    return response.data.response;
  } catch (error) {
    console.error("Error sending message to chatbot:", error);
    throw error;
  }
};

// Analyze mood based on conversation text
export const analyzeMood = async (userInput) => {
  try {
    const response = await axios.post(`${API_URL}/analyze-mood`, { userInput });
    return response.data.mood;
  } catch (error) {
    console.error("Error analyzing mood:", error);
    throw error;
  }
};

// Save the diary entry to localStorage
export const saveDiaryEntry = (date, diaryEntry) => {
  try {
    const existingData = JSON.parse(localStorage.getItem(date) || '{}');
    const updatedData = { ...existingData, ...diaryEntry };
    localStorage.setItem(date, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error saving diary entry:", error);
  }
};

// Fetch diary entry for a specific date from localStorage
export const getDiaryEntryForDate = (date) => {
  try {
    const entry = JSON.parse(localStorage.getItem(date) || '{}');
    return Object.keys(entry).length > 0 ? entry : null;
  } catch (error) {
    console.error("Error fetching diary entry for date:", error);
    return null;
  }
};

// Fetch all diary entries from localStorage
export const fetchDiaryEntries = () => {
  try {
    const entries = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.match(/^\d{4}-\d{2}-\d{2}$/)) { // Check if key is a date
        entries[key] = JSON.parse(localStorage.getItem(key));
      }
    }
    return entries;
  } catch (error) {
    console.error("Error fetching all diary entries:", error);
    return {};
  }
};

export const transcribeAudio = async (audioUrl) => {
  try {
    const response = await axios.post(`${API_URL}/transcribe`, { audioUrl });
    return response.data.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
};