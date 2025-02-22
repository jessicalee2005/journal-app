import mic from "../assets/mic.png";

function AddEntry() {
  return (
    <div className="add-entry-page">
      <h1>talk to me!</h1>
      <button className="mic-button">
        <img src={mic} alt="Microphone" className="mic-icon" />
      </button>
    </div>
  );
}

export default AddEntry;
