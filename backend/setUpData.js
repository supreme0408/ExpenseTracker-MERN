require('dotenv').config();
const USERNAME =process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const mongoose = require('mongoose');
const Transactions = require('./models/Transaction');
const connection = "mongodb+srv://"+USERNAME+":"+PASSWORD+"@cluster0.febxzwi.mongodb.net/expense-et?retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));

// Data to be inserted
const expensesData = [
    {
    amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-01-15T14:57:46.566Z")
    },
    {
      amount: 60,
      uid:"UA02",
    type: "expense",
    category: "transport",
    date: new Date("2023-01-18T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-02-13T14:57:46.566Z")
    },
    {
      amount: 50,
      uid:"UA02",
    type: "expense",
    category: "transport",
    date: new Date("2023-02-18T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-03-15T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-04-15T14:57:46.566Z")
    },
    {
      amount: 40,
      uid:"UA02",
    type: "expense",
    category: "transport",
    date: new Date("2023-04-18T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-05-15T14:57:46.566Z")
    },
    {
      amount: 40,
      uid:"UA02",
    type: "expense",
    category: "transport",
    date: new Date("2023-05-18T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-06-15T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-07-15T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-08-15T14:57:46.566Z")
    },
    {
      amount: 40,
      uid:"UA02",
    type: "expense",
    category: "transport",
    date: new Date("2023-08-18T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-09-15T14:57:46.566Z")
    },
    {
      amount: 50,
      uid:"UA02",
    type: "expense",
    category: "transport",
    date: new Date("2023-09-18T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-10-15T14:57:46.566Z")
    },
    {
      amount: 50,
      uid:"UA02",
    type: "expense",
    category: "transport",
    date: new Date("2023-10-18T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-11-15T14:57:46.566Z")
    },
    {
      amount: 300,
      uid:"UA02",
    type: "expense",
    category: "food",
    date: new Date("2023-12-15T14:57:46.566Z")
    },
    {
      amount: 80,
      uid:"UA02",
    type: "expense",
    category: "transport",
    date: new Date("2023-12-18T14:57:46.566Z")
    },
    
  ];
  
  const incomesData = [
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-01-15T14:57:46.566Z")
    },
    {
      amount: 600,
      uid:"UA02",
    type: "income",
    category: "bonus",
    date: new Date("2023-01-18T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-02-13T14:57:46.566Z")
    },
    {
      amount: 400,
      uid:"UA02",
    type: "income",
    category: "bonus",
    date: new Date("2023-02-18T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-03-15T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-04-15T14:57:46.566Z")
    },
    {
      amount: 200,
      uid:"UA02",
    type: "income",
    category: "bonus",
    date: new Date("2023-04-18T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-05-15T14:57:46.566Z")
    },
    {
      amount: 100,
      uid:"UA02",
    type: "income",
    category: "bonus",
    date: new Date("2023-05-18T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-06-15T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-07-15T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-08-15T14:57:46.566Z")
    },
    {
      amount: 500,
      uid:"UA02",
    type: "income",
    category: "bonus",
    date: new Date("2023-08-18T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-09-15T14:57:46.566Z")
    },
    {
      amount: 400,
      uid:"UA02",
    type: "income",
    category: "bonus",
    date: new Date("2023-09-18T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-10-15T14:57:46.566Z")
    },
    {
      amount: 100,
      uid:"UA02",
    type: "income",
    category: "bonus",
    date: new Date("2023-10-18T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-11-15T14:57:46.566Z")
    },
    {
      amount: 2000,
      uid:"UA02",
    type: "income",
    category: "salary",
    date: new Date("2023-12-15T14:57:46.566Z")
    },
    {
      amount: 800,
      uid:"UA02",
    type: "income",
    category: "bonus",
    date: new Date("2023-12-18T14:57:46.566Z")
    },
  ];
  // Function to insert expenses and incomes
  async function insertData() {
    try {

  
  
        // Insert expenses and incomes data
        await Transactions.insertMany(expensesData);
        // await Transactions.insertMany(incomesData);
  
        console.log('Data inserted successfully!');
    } catch (err) {
        console.error('Error inserting data: ', err);
    } finally {
        // Close the client
        await  mongoose.connection.close();
    }
  }
  // Call the function create database
  // createDatabaseAndCollections();
  // Call the function to insert data
  insertData();