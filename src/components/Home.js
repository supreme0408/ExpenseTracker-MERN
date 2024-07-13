// Home.js
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TransactionsLineChart from './Graph_Component/TransactionsLineChart';
import "../style-css/core.css";

const Home = () => {
  const [expense, setExpense] = useState(null);
  const [income, setIncome] = useState(null);
  const [latestTransaction, setLatestTransaction] = useState(null);
  const [totalIncomeData, setTotalIncomeData] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    // Get all tab buttons and content panes
    const tabs = document.querySelectorAll('#tabList .nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const token = Cookies.get('token');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Hide all content panes
        tabPanes.forEach(pane => {
          pane.classList.remove('active');
        });

        // Show the clicked tab's content pane
        const targetPane = document.getElementById(tab.getAttribute('data-target'));
        targetPane.classList.add('active');

        // Deactivate all tabs
        tabs.forEach(t => {
          t.classList.remove('active');
        });

        // Activate the clicked tab
        tab.classList.add('active');
      });
    });
    if (!latestTransaction) {
      const fetchTransactionData = async () => {
        const token = Cookies.get('token');
        try {
          const response = await axios.get('http://localhost:3001/api/transac/get-transaction', {
            headers: {
              Authorization: `${token}`,
            },
          });
          const { latestTransaction } = response.data;
          setLatestTransaction(latestTransaction);

        } catch (error) {
          console.error('Error fetching user data:', error.response);
        }
      };
      fetchTransactionData();
    }
    const getUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUser(response.data);
      }
      catch (error) {
        console.error('Error fetching user data: ', error.response);
        navigate('/*')
      }
    }
    if (!user) {
      getUser()
    }

  }, [latestTransaction]);
  // Chart options

  return (
    <>
      <div class="text">Home</div>
      <div className="card">
        <div className="card-body">
          <h5 class="card-title text-primary">Welcome {user ? user.username : <span></span>} 🎉</h5>
          <p class="mb-4">Your Expense Tracker is here to help you.</p>
          <p class="mb-4">Your Uid: {user ? user.uid : <span></span>}</p>
          <p>  Net Balance: ₹{user ?user.netBalance: <span></span>}</p>
        </div>
        <div className='image-holder'>
          <img src='/images/man-with-laptop-light.png' alt='img1' height={'140'} />
        </div>
      </div>

      <div className="card-container">
        <TransactionsLineChart/>
        <div className="transaction-list-container">
          <div className="transaction-card">
            <div className="transaction-card-header">
              <h5>Recent Transactions</h5>
            </div>
            <div className="transaction-card-body">
              <ul>
                {latestTransaction ? latestTransaction.map((transaction, index) => (
                  <li key={index} className="transaction-item">
                    <div className="transaction-icon">
                      {transaction.type === "income" ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="none" stroke="green" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"><path d="M31 34L43 34" /><path d="M43 26V10C43 8.34315 41.6569 7 40 7H8C6.34315 7 5 8.34315 5 10V38C5 39.6569 6.34315 41 8 41H28.4706" /><path d="M36 39L31 34L35.9996 29" /><path d="M15 15L20 21L25 15" /><path d="M14 27H26" /><path d="M14 21H26" /><path d="M20 21V33" /></g></svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="none" stroke="red" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"><path d="M31 34h12m-5 5l5-5l-5-5" /><path d="M43 26V10a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v28a3 3 0 0 0 3 3h20.47" /><path d="m15 15l5 6l5-6M14 27h12m-12-6h12m-6 0v12" /></g></svg>
                      }
                    </div>
                    <div className="transaction-details">
                      <small className="transaction-type">{transaction.type}</small>
                      <h5 className="transaction-category">{transaction.category}</h5>
                      <div className="transaction-amount">
                        <h5>{transaction.amount}</h5>
                        <span>INR</span>
                      </div>
                    </div>
                  </li>
                )) : <span>No transactions found</span>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
