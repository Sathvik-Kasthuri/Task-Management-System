import { useNavigate } from "react-router-dom";
import "./Navbar.css"

const Navbar = ({darkMode}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/signin");
  };

  return (
     <nav className={`navbar ${darkMode ? "navbar-dark" : ""}`}>
      <h2>Task Manager</h2>

      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;