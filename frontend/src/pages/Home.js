import { useState } from "react";
import "./Home.css";
import left from "../assets/left.png";
import right from "../assets/right.png";

const images = [
  "../assets/sad.jpg",
  "../assets/happy.jpeg",
  "../assets/mid.jpg",
];

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

  const renderDaysGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const randomImage = images[Math.floor(Math.random() * images.length)]; // Random image selection

      days.push(
        <div key={day} className="day">
          <img src={randomImage} alt={`Day ${day}`} className="day-image" />
        </div>
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
    </div>
  );
}

export default Home;
