import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const TransactionPage = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [selectedMonth, setSelectedMonth] = useState(2); // March as default (index starts from 0)
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Fetch transactions based on month, page, and search term
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions', {
        params: { month: selectedMonth + 1, page, search: searchTerm },
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch transaction statistics based on selected month
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/transaction-stats', {
        params: { month: selectedMonth + 1 },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch chart data for price range based on selected month
  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/transaction-price-range', {
        params: { month: selectedMonth + 1 },
      });
      const labels = response.data.ranges.map(range => `${range.min}-${range.max}`);
      const data = response.data.ranges.map(range => range.count);
      setChartData({
        labels,
        datasets: [{
          label: 'Number of Items',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Trigger data fetches when selected month, page, or search term changes
  useEffect(() => {
    fetchTransactions();
    fetchStats();
    fetchChartData();
  }, [selectedMonth, page, searchTerm]);

  return (
    <div className="transaction-page">
      <h1>Transaction Dashboard</h1>
      
      {/* Month Selection */}
      <label>
        Select Month:
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </label>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Transaction Statistics */}
      <div className="stats">
        <div>Total Sales: ${stats.totalSales || 0}</div>
        <div>Total Sold Items: {stats.soldItems || 0}</div>
        <div>Total Not Sold Items: {stats.notSoldItems || 0}</div>
      </div>

      {/* Transactions Table */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>${transaction.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {/* Bar Chart */}
      <div className="chart">
        <Bar data={chartData} options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Number of Items' },
            },
            x: {
              title: { display: true, text: 'Price Range' },
            }
          },
        }} />
      </div>
    </div>
  );
};

export default TransactionPage;
