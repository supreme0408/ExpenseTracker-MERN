import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../style-css/core.css";
const About = ()=>{

    return (
        <>
        <div class="text">About</div>
      <div className="card">
        <div className="card-body">
          <h5 class="card-title text-primary">Thanks For Using 🙏</h5>
          <p class="mb-4">Your Expense Tracker</p>
          <p class="mb-4">Made with ❤️ by Ramanuj Darvekar</p>
        </div>
        <div className='image-holder'>
          <img src='/images/about2.png' alt='img2' height={'160'} />
        </div>
      </div>
      </>
    );
}

export default About;