import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import "../style-css/core.css";

const ExpenseAddr = () => {
  const [isExpense, setIsExpense] = useState(true);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [incomeData, setIncomeData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);


  const toggleExpenseIncome = () => {
    setIsExpense(!isExpense);
  };

  const handleAddTransac = async () => {
    try {
      console.log("Amount:" + amount + " Category= " + category);
      if (category === '') {
        throw new Error('Category cannot be empty');
      }
      if (amount === '') {
        throw new Error('Amount cannot be empty');
      }
      const token = Cookies.get('token');
      let type = '';
      isExpense ? type = 'expense' : type = 'income';
      const response = await axios.post('http://localhost:3001/api/transac/add-transac', { amount, category, type }, {
        headers: {
          Authorization: `${token}`, // Attach the token to the request headers
        },
      });

      console.log('Transaction added:', response.data);
      alert(response.data.message);

      window.location.reload();
    } catch (error) {
      alert(error);
      console.error('Error adding Transaction:', error);
      // Handle errors here
    }
  };

  // const handleAddExpense = async () => {
  //     try {
  //         console.log("Amount:"+ amount+" Category= "+ category);
  //         const token = Cookies.get('token'); 
  //         const response = await axios.post('http://localhost:3001/api/auth/add-expense', {amount,category},{
  //             headers: {
  //                 Authorization: `${token}`, // Attach the token to the request headers
  //             },
  //         });

  //         console.log('Expense added:', response.data);
  //         alert(response.data.message);
  //         // You can add logic here to handle successful addition of expense
  //     } catch (error) {
  //         console.error('Error adding expense:', error);
  //         // Handle errors here
  //     }
  // };
  useEffect(() => {

    const getTransactionData = async () => {
      const token = Cookies.get('token');
      try {
        const response1 = await axios.get('http://localhost:5000/api/transac/get-transaction', {
          headers: {
            Authorization: `${token}`
          }
        });
        setTransactionData(response1.data.latestTransaction);

        const response2 = await axios.get('http://localhost:5000/api/transac/get-income-data', {
          headers: {
            Authorization: `${token}`
          }
        });
        setIncomeData(response2.data.income);

        const response3 = await axios.get('http://localhost:5000/api/transac/get-expense-data', {
          headers: {
            Authorization: `${token}`
          }
        });
        setExpenseData(response3.data.expense);

      } catch (error) {
        console.error('Error fetching Transaction data: ', error.message);
      }
    };

    getTransactionData();

  }, [])

  return (
    <>
      <div class="text">Add Income/Expense</div>
      <div style={{ display: 'flex', justifyContent: 'space-around', position: 'relative', maxWidth: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: 'white', borderRadius: '10px', width: '50%' }}>
          <button onClick={toggleExpenseIncome} style={{borderRadius:'10px', width:'inherit',marginBottom:'5px'}}>
            {isExpense ? 'Switch to Add Income' : 'Switch to Add Expense'}
          </button>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'10px',marginBottom:'20px'}}>
          <label style={{fontSize:'18px',fontWeight:'400',fontFamily: "Poppins-Regular"}}>Type:
          <input
            type="text"
            value={isExpense ? 'Expense' : 'Income'}
            readOnly
          /> </label>
          <label style={{fontSize:'18px',fontWeight:'400',fontFamily: "Poppins-Regular"}}>Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          /></label>
          <label style={{fontSize:'18px',fontWeight:'400',fontFamily: "Poppins-Regular"}}>Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="shopping">Shopping</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="other">Other</option>
          </select>
          </label>
          <button onClick={handleAddTransac}>Add {isExpense ? 'Expense' : 'Income'}</button>
          </div>
        </div>
      <div style={{display:'flex'}}>
      <div className="transaction-list-container">
        <div className="transaction-card">
          <div className="transaction-card-header">
            <h5>Top 5 Income Transactions</h5>
          </div>
          <div className="transaction-card-body">
            <ul>
              {incomeData ? incomeData.map((income, index) => (
                <li key={index} className="transaction-item">
                  <div className="transaction-icon">
                      <i class='bx bx-rupee' style={{ color: '#28fd0b' }}  ></i>
                  </div>
                  <div className="transaction-details">
                    <h6 className="transaction-category">{income.category}</h6>
                    <div className="transaction-amount">
                      <h5>{income.amount}</h5>
                      <span>INR</span>
                    </div>
                  </div>
                </li>
              )) : <span>No Data found</span>}
            </ul>
          </div>
        </div>
      </div>

      <div className="transaction-list-container">
        <div className="transaction-card">
          <div className="transaction-card-header">
            <h5>Top 5 Expense Transactions</h5>
          </div>
          <div className="transaction-card-body">
            <ul>
              {expenseData ? expenseData.map((expense, index) => (
                <li key={index} className="transaction-item">
                  <div className="transaction-icon">
                    <i class='bx bx-rupee' style={{color:'#f9060a'}}  ></i>
                  </div>
                  <div className="transaction-details">
                    <h6 className="transaction-category">{expense.category}</h6>
                    <div className="transaction-amount">
                      <h5>{expense.amount}</h5>
                      <span>INR</span>
                    </div>
                  </div>
                </li>
              )) : <span>No Data found</span>}
            </ul>
          </div>
        </div>
      </div>
      </div>
      </div>
    </>
  );
}

export default ExpenseAddr;