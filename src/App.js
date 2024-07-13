import React, {useState, useEffect} from 'react'
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import NoMatch from './components/NoMatch';
import Layout from './components/Layout';
import Home from './components/Home';
import ExpenseAddr from './components/ExpenseAddr';
import SplitWise from './components/SplitWise';
import About from './components/About';
import Analytics from './components/Analytics';

// -----
const App = function () {

	return (
		<>
		<Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
		  <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="expense-addr" element={<ExpenseAddr />} />
          <Route path="splitwise" element={<SplitWise />} />
          <Route path="about" element={<About />} />
          <Route path="analytics" element={<Analytics/>}/>
        </Route>
          <Route path="*" element={<NoMatch />} />
       </Routes>
		</>
	);
};
export default App