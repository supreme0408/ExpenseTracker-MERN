import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const GroupDetails = ({ groupId }) => {
  const [group, setGroup] = useState(null);
  const [newPayment, setNewPayment] = useState({ amount: '', description: '' });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch group details
    const fetchGroupDetails = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`http://localhost:5000/api/splitwise/${groupId}`,{
            headers:{
              Authorization:`${token}`
            }
          });
        setGroup(response.data);
      } catch (error) {
        console.error('Error fetching group details', error);
      }
    };

    fetchGroupDetails();

    const fetchPayments = async () => {
        try {
          setLoading(true);
          const token = Cookies.get('token'); 
          const response = await axios.get(`http://localhost:5000/api/splitwise/${groupId}/payments`, {
            headers: {
              Authorization: `${token}`, // Attach the token to the request headers
            },
          });
          setPayments(response.data);
          setLoading(false);
        } catch (error) {
          setError('Error fetching payment details');
          setLoading(false);
        }
      };
  
      if (groupId) {
        fetchPayments();
      }
  }, [groupId]);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const handleAddPayment = async () => {
    try {
    const token = Cookies.get('token');
      const response = await axios.post(`http://localhost:5000/api/splitwise/${groupId}/payments`, newPayment,{
        headers:{
          Authorization:`${token}`
        }
      });
      setGroup({ ...group, payments: [...group.payments, response.data] });
      setPayments([...payments, response.data]);
      setNewPayment({ amount: '', description: '' });
    } catch (error) {
      console.error('Error adding payment', error);
    }
  };

  const handleSplitPayments = async () => {
    try {
        const token = Cookies.get('token');
        // console.log("Token: ", token);
        // console.log("GRPID: ",groupId);
      const response = await axios.post(`http://localhost:5000/api/splitwise/${groupId}/split`,{},{
        headers:{
          Authorization:`${token}`
        }
    });
      alert(`Settlement:\n${JSON.stringify(response.data.transactions, null, 2)}`);
      // Refresh group details
      const updatedGroup = await axios.get(`http://localhost:5000/api/splitwise/${groupId}`,{
        headers:{
          Authorization:`${token}`
        }
    });
      setGroup(updatedGroup.data);
      setPayments(updatedGroup.data.payments);
    } catch (error) {
      console.error('Error splitting payments', error);
    }
  };

  if (!group) return <div>Loading...</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="group-details">
      <h2>Group Payments</h2>
      <h2>{group.name}</h2>
      {payments.length === 0 ? (
        <p>No payments to display.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Payer</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.payer}</td>
                <td>₹{payment.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <input
          type="number"
          name="amount"
          value={newPayment.amount}
          onChange={handlePaymentChange}
          placeholder="Amount"
        />
        <input
          type="text"
          name="description"
          value={newPayment.description}
          onChange={handlePaymentChange}
          placeholder="Description"
        />
        <button onClick={handleAddPayment}>Add Payment</button>
      </div>
      <button onClick={handleSplitPayments}>Split Payments</button>
    </div>
  );
};

export default GroupDetails;
