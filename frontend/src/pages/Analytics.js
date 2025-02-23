// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import "./Analytics.css";

// // Sample data
// const entryData = [
//   { time: "2025-02-01", mood: "high", sleepTime: 8, physicalHealth: "good" },
//   { time: "2025-02-02", mood: "low", sleepTime: 6, physicalHealth: "mid" },
//   { time: "2025-02-03", mood: "mid", sleepTime: 7, physicalHealth: "bad" },
// ];

// const Analytics = () => {
//   const moodData = entryData.map((entry) => ({
//     time: entry.time,
//     mood: entry.mood === "high" ? 1 : entry.mood === "low" ? 0 : 0.5,
//   }));

//   const sleepData = entryData.map((entry) => ({
//     time: entry.time,
//     sleepTime: entry.sleepTime,
//   }));

//   const healthData = entryData.map((entry) => ({
//     time: entry.time,
//     health:
//       entry.physicalHealth === "good"
//         ? 1
//         : entry.physicalHealth === "bad"
//         ? 0
//         : 0.5,
//   }));

//   const calendarData = entryData.map((entry) => ({
//     date: entry.time,
//     healthStatus: entry.physicalHealth,
//   }));

//   const renderHealthClass = (date) => {
//     const formattedDate = date.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'

//     console.log("Checking date:", formattedDate); // Log the date being checked

//     // Find the corresponding entry in calendarData based on the formatted date
//     const entry = calendarData.find((entry) => entry.date === formattedDate);

//     if (entry) {
//       console.log("Found entry:", entry); // Log the found entry

//       if (entry.healthStatus === "good") return "green";
//       if (entry.healthStatus === "bad") return "red";
//       if (entry.healthStatus === "mid") return "yellow";
//     }

//     return "gray";
//   };

//   return (
//     <div className="analytics-container">
//       <h1 className="title">Analytics</h1>

//       {/* Wrapper div for the charts */}
//       <div className="charts-wrapper">
//         {/* Chart 1: Mood Over Time */}
//         <div className="chart-container">
//           <h2 className="chart-title">Mood Log</h2>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={moodData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="time" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="mood" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Chart 2: Sleep Time Over Time */}
//         <div className="chart-container">
//           <h2 className="chart-title">Sleep Log</h2>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={sleepData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="time" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="sleepTime" stroke="#82ca9d" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Chart 3: Physical Health Over Time */}
//         <div className="chart-container">
//           <h2 className="chart-title">Physical Log</h2>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={healthData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="time" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="health" stroke="#ff7300" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Chart 4: Health Status Calendar */}
//         <div className="calendar-container">
//           <h2 className="chart-title">Health Status Calendar</h2>
//           <div className="calendar-chart">
//             <Calendar tileClassName={({ date }) => renderHealthClass(date)} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Analytics.css";
import { fetchDiaryEntries, analyzeSleepAndHealth } from "../utils/api"; // Import the new function

const Analytics = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAndAnalyzeData = async () => {
      // Fetch all diary entries from localStorage
      const entries = fetchDiaryEntries();

      // Transform entries into chart data with sleep and health analysis
      const transformedData = await Promise.all(
        Object.keys(entries).map(async (date) => {
          const entry = entries[date];
          const { mood, conversation } = entry;

          // Analyze sleep and health from conversation
          const { sleepTime, physicalHealth } = await analyzeSleepAndHealth(conversation);

          // Quantify mood (scale: 0 to 1), default to Neutral (0.5) if null
          const moodValue = mood === null || mood === undefined
            ? 0.5
            : {
                Happy: 1,
                Excited: 0.9,
                Neutral: 0.5,
                Anxious: 0.3,
                Angry: 0.2,
                Sad: 0.1,
              }[mood] || 0.5;

          // Use analyzed sleep time (hours), default to 0 if null
          const sleepTimeValue = sleepTime === null || sleepTime === undefined ? 0 : sleepTime;

          // Quantify physical health (scale: 0 to 1), default to mid (0.5) if null
          const healthValue = physicalHealth === null || physicalHealth === undefined
            ? 0.5
            : {
                good: 1,
                mid: 0.5,
                bad: 0,
              }[physicalHealth] || 0.5;

          return {
            time: date,
            mood: moodValue,
            sleepTime: sleepTimeValue,
            physicalHealth: healthValue,
            healthStatus: physicalHealth === null || physicalHealth === undefined ? "mid" : physicalHealth,
          };
        })
      );

      setChartData(transformedData);
    };

    fetchAndAnalyzeData();
  }, []);

  // Data for each chart
  const moodData = chartData.map((entry) => ({
    time: entry.time,
    mood: entry.mood,
  }));

  const sleepData = chartData.map((entry) => ({
    time: entry.time,
    sleepTime: entry.sleepTime,
  }));

  const healthData = chartData.map((entry) => ({
    time: entry.time,
    health: entry.physicalHealth,
  }));

  const calendarData = chartData.map((entry) => ({
    date: entry.time,
    healthStatus: entry.healthStatus,
  }));

  const renderHealthClass = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
    const entry = calendarData.find((entry) => entry.date === formattedDate);

    if (entry) {
      if (entry.healthStatus === "good") return "green";
      if (entry.healthStatus === "bad") return "red";
      if (entry.healthStatus === "mid") return "yellow";
    }

    return "gray";
  };

  return (
    <div className="analytics-container">
      <h1 className="title">Analytics</h1>

      <div className="charts-wrapper">
        {/* Chart 1: Mood Over Time */}
        <div className="chart-container">
          <h2 className="chart-title">Mood Log</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 1]} ticks={[0, 0.1, 0.2, 0.3, 0.5, 0.9, 1]} />
              <Tooltip formatter={(value) => {
                if (value === 1) return "Happy";
                if (value === 0.9) return "Excited";
                if (value === 0.5) return "Neutral";
                if (value === 0.3) return "Anxious";
                if (value === 0.2) return "Angry";
                if (value === 0.1) return "Sad";
                return "Unknown";
              }} />
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Sleep Time Over Time */}
        <div className="chart-container">
          <h2 className="chart-title">Sleep Log</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 12]} />
              <Tooltip formatter={(value) => `${value} hours`} />
              <Legend />
              <Line type="monotone" dataKey="sleepTime" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Physical Health Over Time */}
        <div className="chart-container">
          <h2 className="chart-title">Physical Log</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 1]} ticks={[0, 0.5, 1]} />
              <Tooltip formatter={(value) => (value === 1 ? "Good" : value === 0 ? "Bad" : "Mid")} />
              <Legend />
              <Line type="monotone" dataKey="health" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Health Status Calendar */}
        <div className="calendar-container">
          <h2 className="chart-title">Health Status Calendar</h2>
          <div className="calendar-chart">
            <Calendar tileClassName={({ date }) => renderHealthClass(date)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;