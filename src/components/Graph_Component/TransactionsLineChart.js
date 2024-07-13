import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const TransactionsLineChart = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`http://localhost:5000/api/transac/count/${year}`, {
        headers: {
          Authorization: `${token}`
        }
      });

      const data = response.data;
      const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const transactionCounts = data.map(item => item.count);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Number of Transactions',
            data: transactionCounts,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching line chart data:', error);
      setError('No data found for the selected year');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <div className="card" style={{ width: '80%', margin: 'auto' }}>
      <div className="card-body">
        <h2>Transactions per Month</h2>
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
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Line data={chartData} options={{
            maintainAspectRatio: true,
            scales: {
              x: {
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  display: false
                }
              }
            },
            elements: {
              line: {
                borderWidth: 2
              },
              point: {
                radius: 4
              }
            }
          }}  />
        )}
      </div>
    </div>
  );
};

export default TransactionsLineChart;
