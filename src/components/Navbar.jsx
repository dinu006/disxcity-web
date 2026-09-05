import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <NavLink to="/" className="logo">
          Disxcity
        </NavLink>

        <div className="nav-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/ncert"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            NCERT
          </NavLink>

          <NavLink
            to="/pyq"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            PYQ
          </NavLink>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;