import { useState } from "react";
import "./Home.css";
import left from "../assets/left.png";
import right from "../assets/right.png";
import sad from "../assets/sad.jpg";
import happy from "../assets/happy.jpeg";
import neutral from "../assets/neutral.jpg";
import anxious from "../assets/anxious.png";
import angry from "../assets/angry.jpg";
import excited from "../assets/excited.jpg";
import gray from "../assets/gray.jpeg";
import { getDiaryEntryForDate } from "../utils/api";

const mood_images = {
  Happy: happy,
  Sad: sad,
  Angry: angry,
  Excited: excited,
  Anxious: anxious,
  Neutral: neutral,
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // Store selected day
  const [currEntry, setCurrEntry] = useState(null); // Store selected day
  const [modalOpen, setModalOpen] = useState(false); // Manage modal visibility

  // Descriptions for each day (just an example, you can customize)
  const descriptions = {
    1: "Description for day 1",
    2: "Description for day 2",
    3: "Description for day 3",
    // Add descriptions for each day
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const handleDayClick = (day, diary) => {
    setSelectedDay(day); // Set the selected day
    console.log(day, diary);
    setCurrEntry(diary);
    setModalOpen(true); // Open the modal
  };

  const renderDaysGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>); // Fix key generation
    }

    for (let day = 1; day <= daysInMonth; day++) {
      let randomImage = gray; // Random image selection

      let date_key = `${year}-${month}-${day}`;
      console.log(day)
      if (month + 1 < 10) {
        if (day < 10) {
          date_key = `${year}-0${month + 1}-0${day}`;
        } else {
          date_key = `${year}-0${month + 1}-${day}`;
        }
      }

      console.log(date_key);
      let entries = getDiaryEntryForDate(date_key);
      let diary = null;
      let disabled = true;
      if (entries != null) {
        disabled = false;
        randomImage = mood_images[entries?.mood] || gray;
        diary = entries?.diary || null;
      }
      console.log(entries)

      days.push(
        <button
          key={day}
          disabled={disabled}
          className="day"
          onClick={() => handleDayClick(day, diary)} // Make each day clickable
        >
          <img src={randomImage} alt={`Day ${day}`} className="day-image" />{" "}
          {/* Fix alt syntax */}
          <div className="day-number">{day}</div>
        </button>
      );
    }

    return days;
  };

  return (
    <div className="home-page">
      <div className="month-navigation">
        <button onClick={handlePrevMonth}>
          <img src={left} alt="Previous Month" />
        </button>
        <h1>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h1>
        <button onClick={handleNextMonth}>
          <img src={right} alt="Next Month" />
        </button>
      </div>

      <div className="calendar-grid">{renderDaysGrid()}</div>

      {/* Modal Popup */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {monthNames[currentDate.getMonth()+1]} {selectedDay},{" "}
              {currentDate.getFullYear()}
            </h2>
            <p>{currEntry || "No description available."}</p>
            <button
              className="modal-button"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
