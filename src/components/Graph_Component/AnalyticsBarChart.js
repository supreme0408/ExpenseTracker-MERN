import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const AnalyticsBarChart = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`http://localhost:5000/api/transac/analytics/bar/${year}`, {
          headers: {
            Authorization: `${token}`
          }
        });

        const data = response.data;
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const incomeData = data.map(item => item.income);
        const expenseData = data.map(item => -Math.abs(item.expense));

        setChartData({
          labels,
          datasets: [
            {
              label: 'Income',
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              data: incomeData
            },
            {
              label: 'Expense',
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              data: expenseData
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
        setError('No data found for the selected year');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ width: '90%', height: '100%' }}>
      <h2>Monthly Analytics</h2>
      <label>
        Select Year:
        <select value={year} onChange={handleYearChange}>
          {[...Array(5)].map((_, index) => {
            const yearOption = new Date().getFullYear() - index;
            return <option key={yearOption} value={yearOption}>{yearOption}</option>;
          })}
        </select>
      </label>
      <Bar data={chartData} options={{
        maintainAspectRatio: true,
        scales: {
          x: {
            beginAtZero: true,
            stacked: true,
          },
          y: {
            beginAtZero: true,
            stacked: true,
            ticks: {
              display: false, // Hide the y-axis labels
            },

          }
        },
        elements: {
          bar: {
            borderRadius: 20, // Set border radius for bars
            borderSkipped: false, // Remove the default border skip
            barThickness: 4, // Make the bars thin
            maxBarThickness: 3, // Enforce max bar thickness
            minBarLength: 1, // Set min bar length for visibility
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          }
        }
      }} />
    </div>
  );
};

export default AnalyticsBarChart;
