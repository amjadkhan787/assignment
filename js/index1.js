const express = require('express');
const app = express();
const PORT = 3000;

// Sample data (you would replace this with actual database queries)
const items = [
  { price: 50, category: 'A', date: '2024-01-15' },
  { price: 150, category: 'B', date: '2024-01-18' },
  { price: 250, category: 'A', date: '2024-02-10' },
  { price: 350, category: 'C', date: '2024-03-12' },
  { price: 550, category: 'B', date: '2024-03-15' },
  { price: 750, category: 'A', date: '2024-04-20' },
  { price: 950, category: 'C', date: '2024-04-25' },
  // Add more items as needed
];

// Utility function to filter items by month
function filterItemsByMonth(items, month) {
  return items.filter(item => new Date(item.date).getMonth() + 1 === month);
}

// API 1: Bar Chart Data (price range and number of items in each range)
app.get('/api/bar-chart', (req, res) => {
  const month = parseInt(req.query.month);
  const filteredItems = filterItemsByMonth(items, month);

  const priceRanges = [
    { range: '0-100', count: 0 },
    { range: '101-200', count: 0 },
    { range: '201-300', count: 0 },
    { range: '301-400', count: 0 },
    { range: '401-500', count: 0 },
    { range: '501-600', count: 0 },
    { range: '601-700', count: 0 },
    { range: '701-800', count: 0 },
    { range: '801-900', count: 0 },
    { range: '901-above', count: 0 },
  ];

  filteredItems.forEach(item => {
    const { price } = item;
    if (price <= 100) priceRanges[0].count++;
    else if (price <= 200) priceRanges[1].count++;
    else if (price <= 300) priceRanges[2].count++;
    else if (price <= 400) priceRanges[3].count++;
    else if (price <= 500) priceRanges[4].count++;
    else if (price <= 600) priceRanges[5].count++;
    else if (price <= 700) priceRanges[6].count++;
    else if (price <= 800) priceRanges[7].count++;
    else if (price <= 900) priceRanges[8].count++;
    else priceRanges[9].count++;
  });

  res.json(priceRanges);
});

// API 2: Pie Chart Data (unique categories and item counts in each category)
app.get('/api/pie-chart', (req, res) => {
  const month = parseInt(req.query.month);
  const filteredItems = filterItemsByMonth(items, month);

  const categoryCounts = {};

  filteredItems.forEach(item => {
    const { category } = item;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const response = Object.keys(categoryCounts).map(category => ({
    category,
    count: categoryCounts[category]
  }));

  res.json(response);
});

// API 3: Combined Data from Bar and Pie Charts
app.get('/api/combined-chart', async (req, res) => {
  const month = parseInt(req.query.month);

  // Fetch data from the first two endpoints
  const barChartResponse = await fetch(`http://localhost:${PORT}/api/bar-chart?month=${month}`);
  const barChartData = await barChartResponse.json();

  const pieChartResponse = await fetch(`http://localhost:${PORT}/api/pie-chart?month=${month}`);
  const pieChartData = await pieChartResponse.json();

  res.json({
    barChart: barChartData,
    pieChart: pieChartData,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
