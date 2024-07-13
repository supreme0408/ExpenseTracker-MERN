const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Group = require("../models/Group");
const Payment = require("../models/Payment");
require('dotenv').config();

router.post('/make-group', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { name, members } = req.body;
  
      // Check if all members exist in the database
      const existingMembers = await User.find({ uid: { $in: members } }).select('uid');
      const existingMemberIds = existingMembers.map(member => member.uid);
  
      const nonExistingMembers = members.filter(member => !existingMemberIds.includes(member));
  
      if (nonExistingMembers.length > 0) {
        return res.status(400).json({
          message: 'Some members do not exist in the database',
          nonExistingMembers,
        });
      }

      // Ensure members is an array and add the current user's UID to the members list
    if (!Array.isArray(members)) {
        return res.status(400).json({ message: 'Members should be an array' });
      }
      members.push(user.uid);
      const group = new Group({ name, members });
      await group.save();
  
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route to get all group IDs for the current logged-in user
router.get('/my-groups', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find all groups where the logged-in user is a member
      const groups = await Group.find({ members: user.uid }).select('_id name');
  
      const groupDetails = groups.map(group => ({
        _id: group._id.toString(),
        name: group.name
      }));
  
      res.json({ groupDetails });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get('/:name',authMiddleware, async(req,res)=>{
    try{
        const user = req.user;

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        const group = await Group.findById(req.params.name);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
          }
        
          // Fetch the details of each member using their uid
          const members = await Promise.all(
            group.members.map(async (uid) => {
              const user = await User.findOne({ uid }).select('username email');
              return user;
            })
          );
        
          group.members = members;
          res.json(group);
    } catch(error){
        res.status(500).json({message: error.message});
    }
})

// Route to create a payment for a specific group
router.post('/:groupId/payments', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { groupId } = req.params;
      const { amount, description } = req.body;
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      const payment = new Payment({
        group: groupId,
        payer: user.uid,
        amount,
        description,
      });
      await payment.save();
  
      group.payments.push(payment._id);
      await group.save();
  
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post('/:groupId/split', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { groupId } = req.params;
  
      const group = await Group.findById(groupId).populate('payments');
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      const totalAmount = group.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const numMembers = group.members.length;
      const amountPerMember = totalAmount / numMembers;
  
      const balances = {};
      group.members.forEach(member => {
        balances[member] = -amountPerMember;
      });
  
      group.payments.forEach(payment => {
        balances[payment.payer] += payment.amount;
      });
  
      const owes = [];
      const owed = [];
      
      for (const [member, balance] of Object.entries(balances)) {
        if (balance < 0) {
          owes.push({ member, balance: -balance });
        } else if (balance > 0) {
          owed.push({ member, balance });
        }
      }
  
      const transactions = [];
  
      while (owes.length && owed.length) {
        const owe = owes[0];
        const oweTo = owed[0];
  
        const amount = Math.min(owe.balance, oweTo.balance);
  
        transactions.push({
          from: owe.member,
          to: oweTo.member,
          amount,
        });
  
        owe.balance -= amount;
        oweTo.balance -= amount;
  
        if (owe.balance === 0) {
          owes.shift();
        }
        if (oweTo.balance === 0) {
          owed.shift();
        }
      }
  
      // Reset payments in the database for the group
      await Payment.updateMany({ group: groupId }, { amount: 0 });

      // Clear the payments from the group
        group.payments = [];
        await group.save();
  
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route to get payment details for a specific group
router.get('/:groupId/payments', authMiddleware, async (req, res) => {
    try {
        const { groupId } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the group by ID and populate the payments field
        const group = await Group.findById(groupId).populate({
            path: 'payments'
        });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Extract payment details
        const paymentDetails = group.payments.map(payment => ({
            payer: payment.payer,  // Assuming payer has a 'username' field; adjust as necessary
            amount: payment.amount
        }));

        res.json(paymentDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;