import React from "react";
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

// Sample data
const entryData = [
  { time: "2025-02-01", mood: "high", sleepTime: 8, physicalHealth: "good" },
  { time: "2025-02-02", mood: "low", sleepTime: 6, physicalHealth: "bad" },
  { time: "2025-02-03", mood: "mid", sleepTime: 7, physicalHealth: "mid" },
];

const Analytics = () => {
  const moodData = entryData.map((entry) => ({
    time: entry.time,
    mood: entry.mood === "high" ? 1 : entry.mood === "low" ? 0 : 0.5,
  }));

  const sleepData = entryData.map((entry) => ({
    time: entry.time,
    sleepTime: entry.sleepTime,
  }));

  const healthData = entryData.map((entry) => ({
    time: entry.time,
    health:
      entry.physicalHealth === "good"
        ? 1
        : entry.physicalHealth === "bad"
        ? 0
        : 0.5,
  }));

  const calendarData = entryData.map((entry) => ({
    date: entry.time,
    healthStatus: entry.physicalHealth,
  }));

  const renderHealthClass = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'

    console.log("Checking date:", formattedDate); // Log the date being checked

    // Find the corresponding entry in calendarData based on the formatted date
    const entry = calendarData.find((entry) => entry.date === formattedDate);

    if (entry) {
      console.log("Found entry:", entry); // Log the found entry

      if (entry.healthStatus === "good") return "green";
      if (entry.healthStatus === "bad") return "red";
      if (entry.healthStatus === "mid") return "yellow";
    }

    // Default fallback
    return "gray";
  };

  return (
    <div className="analytics-container">
      <h1 className="title">Analytics</h1>

      {/* Wrapper div for the charts */}
      <div className="charts-wrapper">
        {/* Chart 1: Mood Over Time */}
        <div className="chart-container">
          <h2 className="chart-title">Mood Log</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
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
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sleepTime" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Physical Health Over Time */}
        <div className="chart-container">
          <h2 className="chart-title">Physical Health Log</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="health" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Health Status Calendar */}
        <div className="calendar-container">
          <h2 className="chart-title">Health Status Calendar</h2>
          <Calendar tileClassName={({ date }) => renderHealthClass(date)} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
