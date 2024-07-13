import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import '../style-css/style-login.css';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Sending login request to the server...");
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      }, {
        withCredentials: true, // Send cookies with the request
      });
      const token = response.data.token;
      console.log("In frontend token " + token);
      if (token) {
        // Store the token in cookies
        Cookies.set('token', token, { expires: 1 });
        navigate('/home');
      } else {
        console.error("Token is missing or invalid");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Login failed');
      } else if (error.request) {
        setMessage('Network error. Please try again.');
      } else {
        setMessage('An error occurred. Please try again later.');
      }
      console.error('Login failed:', error);
    }
    setLoading(false);
  };

  useEffect(()=>{
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage(null);
      }, 4000);
    }
    return () => clearTimeout(timer);
  },[message]);
  
  return (
      <div className="inner">
      <div className="image-holder">
        <img src="/images/loginPg.jpg" alt="" />
      </div>
      <form action="">
        <h3>Login</h3>
        <div className="form-wrapper">
          <input type="text" placeholder="Username" className="form-control" onChange={(e) => setUsername(e.target.value)} />
          <i className='bx bx-user'></i>
        </div>
        <div className="form-wrapper">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className='bx bx-lock-alt' ></i>
        </div>
        <button onClick={handleLogin}>
        {loading ? <div class="lds-facebook"><div></div><div></div><div></div></div> : <span>Login</span>}
        <i className='bx bx-right-arrow-alt' ></i>
        </button>
        <p style={{ marginTop: "5%" }}>
          Don't have an account?{" "}
          <a style={{ textDecoration: "none", color: "gray" }} href="/register">
            Register Here
          </a>{" "}
          it takes less than a minute
        </p>
      {message ? <p style={{ color: 'crimson' }}>{"Error: " + message}</p> : <span></span>}
      </form>
    </div>
  );
};
export default Login;