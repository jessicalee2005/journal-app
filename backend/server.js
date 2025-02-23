require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const { AssemblyAI } = require("assemblyai");
const assemblyAI = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
const fs = require("fs");


const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: "uploads/" }); // Temporary storage


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// const OPENAI_API_KEY = "lsdifjdkj";

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const requiredTopics = [
      "mood", "sleep time", "physical health", "special events", 
      "stress levels", "diet and exercise"
    ];

    const prompt = `
      You are a friendly chatbot helping the user record a daily diary.
      Your goal is to naturally gather the following topics from the user: ${requiredTopics.join(", ")}.
      If the user hasn't mentioned one, casually ask about it.
      Keep the conversation engaging and natural.
      Here is what the user has said so far:\n\n${messages.map(m => `${m.sender}: ${m.text}`).join("\n")}
      \nBased on the conversation, generate a response and continue guiding the conversation if needed.
    `;

    const chatbotResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" } }
    );

    res.json({ response: chatbotResponse.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error in chat:", error.response?.data || error.message);
    res.status(500).json({ error: "Chatbot failed to respond." });
  }
});

app.post("/analyze-mood", async (req, res) => {
  try {
    const { userInput } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert mood analyst. Based on the user's text, classify their mood as: Happy, Sad, Angry, Excited, Anxious, or Neutral. Consider their tone, words, and context."
          },
          { role: "user", content: userInput },
        ],
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );

    res.json({ mood: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Mood analysis error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze mood" });
  }
});

// app.post("/generate-image", async (req, res) => {
//   try {
//     const { diaryText } = req.body;
//     const response = await axios.post(
//       "https://api.openai.com/v1/images/generations",
//       {
//         prompt: `An artistic representation of: ${diaryText}`,
//         n: 1,
//         size: "512x512",
//       },
//       { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
//     );
//     res.json({ imageUrl: response.data.data[0].url });
//   } catch (error) {
//     console.error("Image generation error:", error);
//     res.status(500).json({ error: "Failed to generate image" });
//   }
// });

// New /transcribe endpoint
app.post("/transcribe", upload.single("audio"), async (req, res) => {
    try {
        
      const audioPath = req.body.audioUrl; // Get the path of the uploaded file
      if (!audioPath) {
        return res.status(400).json({ error: "Audio file is required" });
      }
  
      // Transcribe the audio file directly
      const transcript = await assemblyAI.transcripts.transcribe({
        audio: audioPath, // Use the local file path
      });
  
      // No need for .await(); the promise resolves to the result
      fs.unlinkSync(audioPath); // Clean up the temporary file
      res.json({ text: transcript.text }); // Return the transcribed text
    } catch (error) {
      console.error("Transcription error:", error.message, req.body.audioUrl);
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

app.post("/upload-audio", upload.single("audio"), async (req, res) => {
    try {
    //   const audioPath = req.file.path;
      const audioUrl = `./uploads/${req.file.filename}`; // Temporary URL
      app.use("/uploads", express.static(path.join(__dirname, "uploads")));
      res.json({ audioUrl });
    } catch (error) {
      console.error("Audio upload error:", error);
      res.status(500).json({ error: "Failed to upload audio" });
    }
});
  

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");

// const app = express();
// app.use(express.json());
// app.use(cors());

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// // Route to get GPT response
// // app.post("/chat", async (req, res) => {
// //   try {
// //     const { userInput } = req.body;
// //     const response = await axios.post(
// //       "https://api.openai.com/v1/chat/completions",
// //       {
// //         model: "gpt-4",
// //         messages: [{ role: "user", content: userInput }],
// //       },
// //       { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
// //     );
// //     res.json({ reply: response.data.choices[0].message.content });
// //   } catch (error) {
// //     console.error("Chatbot error:", error);
// //     res.status(500).json({ error: "Failed to get chatbot response" });
// //   }
// // });


// // Route to generate an AI image
// app.post("/generate-image", async (req, res) => {
//   try {
//     const { diaryText } = req.body;
//     const response = await axios.post(
//       "https://api.openai.com/v1/images/generations",
//       {
//         prompt: `An artistic representation of: ${diaryText}`,
//         n: 1,
//         size: "512x512",
//       },
//       { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
//     );
//     res.json({ imageUrl: response.data.data[0].url });
//   } catch (error) {
//     console.error("Image generation error:", error);
//     res.status(500).json({ error: "Failed to generate image" });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.post("/analyze-mood", async (req, res) => {
//     try {
//       const { userInput } = req.body;
  
//       const response = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           model: "gpt-4",
//           messages: [
//             {
//               role: "system",
//               content:
//                 "You are an expert mood analyst. Based on the user's text, classify their mood as: Happy, Sad, Angry, Excited, Anxious, or Neutral. Consider their tone, words, and context."
//             },
//             {
//               role: "user",
//               content: userInput,
//             },
//           ],
//         },
//         { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
//       );
  
//       res.json({ mood: response.data.choices[0].message.content.trim() });
//     } catch (error) {
//       console.error("Mood analysis error:", error);
//       res.status(500).json({ error: "Failed to analyze mood" });
//     }
// });
  

// app.post("/chat", async (req, res) => {
//     try {
//       const { messages } = req.body;
  
//       const requiredTopics = [
//         "mood", "sleep time", "physical health", "special events", "stress levels", "diet and exercise"
//       ];
  
//       const prompt = `
//         You are a friendly chatbot helping the user record a daily diary.
//         Your goal is to naturally gather the following topics from the user: ${requiredTopics.join(", ")}.
//         If the user hasn't mentioned one, casually ask about it.
//         Keep the conversation engaging and natural.
//         Here is what the user has said so far:\n\n${messages.map(m => `${m.sender}: ${m.text}`).join("\n")}
//         \nBased on the conversation, generate a response and continue guiding the conversation if needed.
//       `;
  
//       const chatbotResponse = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           model: "gpt-4",
//           messages: [{ role: "user", content: prompt }],
//         },
//         { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
//       );
  
//       res.json({ response: chatbotResponse.data.choices[0].message.content.trim() });
//     } catch (error) {
//       console.error("Error in chat:", error);
//       res.status(500).json({ error: "Chatbot failed to respond." });
//     }
// });
  