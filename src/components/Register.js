import React, { useState } from 'react';
import axios from 'axios';
import '../style-css/style-login.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/api/auth/register', {
            username,
            email,
            password,
        })
            .then(response => {
                setMessage(response.data.message); // Display success message
                // Optionally, you can redirect the user to the login page after successful registration
                // Implement navigation logic here
            })
            .catch(error => {
                setMessage(error.response.data.message); // Display error message
            });
    };

    return (
        <div className="inner">
      <div className="image-holder">
        <img src="/images/regisPg.png" alt="" />
      </div>
      <form action="">
        <h3>Registration</h3>
        <div className="form-wrapper">
          <input type="text" placeholder="Username" className="form-control" onChange={(e)=>{setUsername(e.target.value)}} />
          <i class='bx bx-user'></i>
        </div>
        <div className="form-wrapper">
          <input
            type="text"
            placeholder="Email Address"
            className="form-control"
            onChange={(e)=>{setEmail(e.target.value)}}
          />
          <i className='bx bx-envelope' ></i>
        </div>

        <div className="form-wrapper">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            onChange={(e)=>{setPassword(e.target.value)}}
          />
          <i className='bx bx-lock-alt' ></i>
        </div>
        <button onClick={handleRegister}>
          Register
          <i className='bx bx-right-arrow-alt' ></i>
        </button>
        <p style={{ position: "relative", marginTop: "5%" }}>
          Already Registered? <a style={{textDecoration:'none', color:'gray'}} href="/">Login In</a>
        </p>
      {message && <div style={{color:'red'}}>{message}</div>}
      </form>
    </div>
  );
};

export default Register;
