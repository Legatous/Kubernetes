
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'smb',
  password: 'postgres',
  port: 5432
});

app.get('/api/health', (req, res) => {
  res.json({ status: "OK" });
});

app.get('/api/profit-loss', async (req, res) => {
  const revenue = await pool.query('SELECT COALESCE(SUM(amount),0) FROM revenue');
  const expenses = await pool.query('SELECT COALESCE(SUM(amount),0) FROM expenses');
  const salaries = await pool.query('SELECT COALESCE(SUM(amount),0) FROM salaries');

  const totalRevenue = revenue.rows[0].coalesce;
  const totalExpenses = expenses.rows[0].coalesce + salaries.rows[0].coalesce;
  const profit = totalRevenue - totalExpenses;

  res.json({ totalRevenue, totalExpenses, profit });
});

app.listen(3001, () => console.log("Backend running on port 3001"));
