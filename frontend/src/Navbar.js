import { Link } from "react-router-dom";
import logo from "../src/assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Logo" className="logo-img" />
        FeelSync
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add-entry">Add Entry</Link>
        </li>
        <li>
          <Link to="/analytics">Analytics</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
