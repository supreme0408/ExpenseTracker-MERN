import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const AnalyticsPieCharts = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [incomeData, setIncomeData] = useState({});
  const [expenseData, setExpenseData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`http://localhost:5000/api/transac/analytics/pie/${year}`, {
          headers: {
            Authorization: `${token}`
          }
        });

        const { incomeData, expenseData } = response.data;

        setIncomeData({
          labels: Object.keys(incomeData),
          datasets: [{
            data: Object.values(incomeData),
            backgroundColor: Object.keys(incomeData).map((_, index) => `hsl(${index * 30}, 70%, 50%)`)
          }]
        });

        setExpenseData({
          labels: Object.keys(expenseData),
          datasets: [{
            data: Object.values(expenseData),
            backgroundColor: Object.keys(expenseData).map((_, index) => `hsl(${index * 30}, 70%, 50%)`)
          }]
        });
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
        setIncomeData(null);
        setExpenseData(null);
      }finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const renderPieChart = (data, title) => {
    if (!data || data.labels.length === 0) {
      return <div>No data found for {title}</div>;
    }
    return <Pie data={data} style={{maxWidth:'180px'}}/>;
  };

  return (
    <div>
      <h2>Category-Wise Analytics</h2>
      <label>
        Select Year:
        <select value={year} onChange={handleYearChange}>
          {[...Array(5)].map((_, index) => {
            const yearOption = new Date().getFullYear() - index;
            return <option key={yearOption} value={yearOption}>{yearOption}</option>;
          })}
        </select>
      </label>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <h3>Income Distribution</h3>
            {renderPieChart(incomeData, 'income')}
          </div>
          <div>
            <h3>Expense Distribution</h3>
            {renderPieChart(expenseData, 'expense')}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPieCharts;
