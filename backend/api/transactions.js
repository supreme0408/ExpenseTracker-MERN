const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

router.post('/add-transac', authMiddleware, async (req, res) => {
    try {
        const { amount, category, type } = req.body;
        const userId = req.user.uid; // Assuming you have userId available after authentication

        // Create a new income transaction associated with the user
        const newTransac = new Transaction({
            uid: userId, // Assign the userId to the 'user' field in the transaction
            type: type,
            amount,
            category
        });
        // Save the new income transaction to the database
        await newTransac.save();
        console.log(type,' added Successfully');
        // Find the user by their username and update the amount by adding the amount
        User.findOneAndUpdate(
            { uid: userId }, // Find user by username
            type==='income'?{ $inc: { netBalance: amount } }:{ $inc: { netBalance: -amount } }, // Increment the 'amount' field by the new value
            { new: true } // To return the updated document
        )
            .then(updatedUser => {
                console.log('Updated user:', updatedUser);
                // Handle the updated user data here
            })
            .catch(error => {
                console.error('Error updating user:', error);
                // Handle errors
            });
        res.status(201).json({ message: type+' added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add transaction', error: error.message });
    }
});



router.get('/get-income-data',authMiddleware,async(req,res)=>{
    try{
        const userID = req.user.uid;
        if(!userID){
            return res.status(404).json({ message: 'User not found' });
        }
        const income = await Transaction.find({uid:userID,type:'income'},{_id:0,category:1,amount:1}).sort({date:-1}).limit(5);
            // Send the user data as a response
        res.status(200).json({
            income:income
        });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
});

router.get('/get-expense-data',authMiddleware,async(req,res)=>{
    try{
        const userID = req.user.uid;
        if(!userID){
            return res.status(404).json({ message: 'User not found' });
        }
        const expense = await Transaction.find({uid:userID,type:'expense'},{_id:0,category:1,amount:1}).sort({date:-1}).limit(5);
            // Send the user data as a response
        res.status(200).json({
            expense: expense
        });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
});

//GET request to retrieve user transaction profile
router.get('/get-transaction',authMiddleware,async (req, res) => {
    try {
      
      const userID = req.user.uid; // User object set in the middleware
  
      if (!userID) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('GET TRANSACTION User:', userID);
    //   const expense = await Transaction.find({uid:userID,type:'expense'});
    //   const income = await Transaction.find({uid:userID, type:'income'});
      const latestTransaction = await Transaction.find({ uid: userID }, { _id: 0, type: 1, category: 1, amount: 1 })
  .sort({ date: -1 }) // Assuming 'date' is the field indicating transaction time
  .limit(5); // Limit the result to 5 entries (latest transactions)


      // Send the user data as a response
      res.status(200).json({
        latestTransaction: latestTransaction
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  // Route to get transaction data for analytics
router.get('/analytics/bar/:year', authMiddleware, async (req, res) => {
    try {
      const { year } = req.params;
      const user = req.user;
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const transactions = await Transaction.find({
        uid: user.uid,
        date: {
          $gte: new Date(`${year}-01-01T00:00:00Z`),
          $lte: new Date(`${year}-12-31T23:59:59Z`)
        }
      });
  
      const analyticsData = Array.from({ length: 12 }, () => ({ income: 0, expense: 0 }));
  
      transactions.forEach(transaction => {
        const month = new Date(transaction.date).getUTCMonth();
        if (transaction.type === 'income') {
          analyticsData[month].income += transaction.amount;
        } else if (transaction.type === 'expense') {
          analyticsData[month].expense += transaction.amount;
        }
      });
  
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route to get aggregated transaction data for pie charts
router.get('/analytics/pie/:year', authMiddleware, async (req, res) => {
    try {
      const { year } = req.params;
      const user = req.user;
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const transactions = await Transaction.find({
        uid: user.uid,
        date: {
          $gte: new Date(`${year}-01-01T00:00:00Z`),
          $lte: new Date(`${year}-12-31T23:59:59Z`)
        }
      });
  
      const incomeData = {};
      const expenseData = {};
  
      transactions.forEach(transaction => {
        if (transaction.type === 'income') {
          if (!incomeData[transaction.category]) {
            incomeData[transaction.category] = 0;
          }
          incomeData[transaction.category] += transaction.amount;
        } else if (transaction.type === 'expense') {
          if (!expenseData[transaction.category]) {
            expenseData[transaction.category] = 0;
          }
          expenseData[transaction.category] += transaction.amount;
        }
      });
  
      res.json({ incomeData, expenseData });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route to count transactions per month for a specific year
router.get('/count/:year', authMiddleware, async (req, res) => {
  try {
      const { year } = req.params;
      const user = req.user;

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Aggregation to count transactions per month
      const transactionsCount = await Transaction.aggregate([
          {
              $match: {
                  uid: user.uid,
                  date: {
                      $gte: new Date(`${year}-01-01`),
                      $lt: new Date(`${year}-12-31`)
                  }
              }
          },
          {
              $group: {
                  _id: { $month: '$date' },
                  count: { $sum: 1 }
              }
          },
          {
              $sort: { _id: 1 }
          }
      ]);

      // Format the result
      const result = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          count: transactionsCount.find(t => t._id === i + 1)?.count || 0
      }));

      res.json(result);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

  module.exports = router;