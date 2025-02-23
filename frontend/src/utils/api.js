import axios from "axios";
import {diaryEntries} from "./diaryEntries"; // MANUALLY POPULATE DATA FOR DEMO

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


export const analyzeSleepAndHealth = async (messages) => {
  try {
    const response = await axios.post(`${API_URL}/analyze-sleep-health`, { messages });
    return response.data; // { sleepTime: number|null, physicalHealth: "good"|"mid"|"bad"|null }
  } catch (error) {
    console.error("Error analyzing sleep and health:", error);
    return { sleepTime: null, physicalHealth: null };
  }
};

export const getDiaryEntryForDate = (date) => {
  try {
    // Retrieve the entry for the given date from localStorage
    const entry = localStorage.getItem(date);

    // If the key doesn't exist or is empty, return null
    if (!entry) {
      console.log("No diary entry found for this date.");
      return null;
    }

    // Parse the entry data
    const parsedEntry = JSON.parse(entry);

    // Return only the "diary" field, or null if it's not present
    return parsedEntry;

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


// MANUALLY POPULATE DATA FOR DEMO
// export const getDiaryEntryForDate = (date) => {
//   try {
//     const entry = diaryEntries[date];
//     if (!entry) {
//       console.log("No diary entry found for this date.");
//       return null;
//     }
//     return entry;
//   } catch (error) {
//     console.error("Error fetching diary entry for date:", error);
//     return null;
//   }
// };

// export const fetchDiaryEntries = () => {
//   try {
//     return diaryEntries;
//   } catch (error) {
//     console.error("Error fetching all diary entries:", error);
//     return {};
//   }
// };
