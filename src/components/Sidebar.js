import { useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      Cookies.remove('token'); // Clear the token from cookies
      alert('logout');
      navigate('/'); // Redirect to the login page or any other appropriate route
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const body = document.querySelector("body"),
      sidebar = body.querySelector("nav"),
      toggle = body.querySelector(".toggle"),
      searchBtn = body.querySelector(".search-box"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");

    const handleToggleClick = () => {
      sidebar.classList.toggle("close");
    };

    const handleSearchClick = () => {
      sidebar.classList.remove("close");
    };

    const handleModeSwitchClick = () => {
      body.classList.toggle("dark");
      if (body.classList.contains("dark")) {
        modeText.innerText = "Light mode";
      } else {
        modeText.innerText = "Dark mode";
      }
    };

    toggle.addEventListener("click", handleToggleClick);
    searchBtn.addEventListener("click", handleSearchClick);
    modeSwitch.addEventListener("click", handleModeSwitchClick);

    return () => {
      toggle.removeEventListener("click", handleToggleClick);
      searchBtn.removeEventListener("click", handleSearchClick);
      modeSwitch.removeEventListener("click", handleModeSwitchClick);
    };
  }, []);

  return (
    <nav className="sidebar close">
      <header>
        <div className="image-text">
          <span className="image">
            <a href="/home"><img src="/walleticon.ico" alt="Logo" /></a>
          </span>
          <div className="text logo-text">
            <span className="name">Expense Tracker</span>
          </div>
        </div>
        <i className="bx bx-chevron-right toggle"></i>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <li className="search-box">
            <i className="bx bx-search icon"></i>
            <input type="text" placeholder="Search" />
          </li>

          <ul className="menu-links">
            <li className="nav-link">
              <a href="/home">
              <i className='bx bxs-dashboard icon' ></i>
                <span className="text nav-text">Dashboard</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="/home/expense-addr">
              <i className='bx bx-rupee icon' ></i>
                <span className="text nav-text">Expense/Income</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="/home/splitwise">
              <i className='bx bx-transfer-alt bx-rotate-270 icon' ></i>
                <span className="text nav-text">SplitWise</span>
              </a>
            </li>
            <li className="nav-link">
            <a href="/home/analytics">
                <i className="bx bx-pie-chart-alt icon"></i>
                <span className="text nav-text">Analytics</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="/home/about">
              <i class='bx bx-help-circle icon'></i>
                <span className="text nav-text">About</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="bottom-content">
          <li>
            <a href="#" onClick={handleLogout}>
              <i className="bx bx-log-out icon"></i>
              <span className="text nav-text">Logout</span>
            </a>
          </li>
          <li className="mode">
            <div className="sun-moon">
              <i className="bx bx-moon icon moon"></i>
              <i className="bx bx-sun icon sun"></i>
            </div>
            <span className="mode-text text">Dark mode</span>
            <div className="toggle-switch">
              <span className="switch"></span>
            </div>
          </li>
        </div>
      </div>
    </nav>
  );
}
