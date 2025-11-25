// backend/routes/financialRoutes.js
const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// GET all expenses for the authenticated user
router.get('/expenses', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new expense for the authenticated user
// In backend/routes/financialRoutes.js, add this to each POST route:
router.post('/expenses', authMiddleware, async (req, res) => {
  console.log('User ID from token:', req.user?.id); // ✅ Debug log
  
  if (!req.user?.id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  
  const { title, amount, category } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO expenses (user_id, title, amount, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, title, amount, category] // ✅ Use req.user.id
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all income for the authenticated user
router.get('/income', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM income WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching income:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new income for the authenticated user
router.post('/income', authMiddleware, async (req, res) => {
  const {
    type, company, company_other, monthly_income, frequency, salary_credit_date,
    mode_of_credit, bank_receiving, employment_type, industry, bonus, incentives,
    additional_monthly, payslip_url
  } = req.body;

  try {
    // Convert strings to numbers, handle empty values
    const monthlyIncome = monthly_income ? Number(monthly_income) : 0;
    const bonusAmount = bonus ? Number(bonus) : 0;
    const incentiveAmount = incentives ? Number(incentives) : 0;
    const additionalMonthly = additional_monthly ? Number(additional_monthly) : 0;

    const result = await pool.query(
      `INSERT INTO income (user_id, type, company, company_other, monthly_income, frequency, salary_credit_date, mode_of_credit, bank_receiving, employment_type, industry, bonus, incentives, additional_monthly, payslip_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [
        req.user.id, type, company, company_other, monthlyIncome, frequency, 
        salary_credit_date, mode_of_credit, bank_receiving, employment_type, 
        industry, bonusAmount, incentiveAmount, additionalMonthly, payslip_url
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all loans for the authenticated user
router.get('/loans', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM loans WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new loan for the authenticated user
router.post('/loans', authMiddleware, async (req, res) => {
  const {
    loanType, lender, provider_other, accountNumber, totalAmount, amountPaid,
    interestRate, emiAmount, emiDueDay, startDate, endDate, paymentMode, status,
    agreementUrl, scheduleUrl, bankStatementUrl
  } = req.body;

  try {
    // Convert strings to numbers, handle empty values
    const totalAmt = totalAmount ? Number(totalAmount) : 0;
    const paidAmt = amountPaid ? Number(amountPaid) : 0;
    const remaining = Math.max(0, totalAmt - paidAmt);
    const interest = interestRate ? Number(interestRate) : 0;
    const emi = emiAmount ? Number(emiAmount) : 0;
    const emiDay = emiDueDay ? Number(emiDueDay) : 1;

    const result = await pool.query(
      `INSERT INTO loans (user_id, loan_type, lender, provider_other, account_number, total_amount, amount_paid, remaining, interest_rate, emi_amount, emi_due_day, start_date, end_date, payment_mode, status, agreement_url, schedule_url, bank_statement_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
      [
        req.user.id, loanType, lender, provider_other, accountNumber, totalAmt, 
        paidAmt, remaining, interest, emi, emiDay, startDate, endDate, 
        paymentMode, status, agreementUrl, scheduleUrl, bankStatementUrl
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding loan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all goals for the authenticated user
router.get('/goals', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new goal for the authenticated user
router.post('/goals', authMiddleware, async (req, res) => {
  const { title, target_amount } = req.body;
  try {
    const targetAmt = target_amount ? Number(target_amount) : 0;
    const result = await pool.query(
      `INSERT INTO goals (user_id, title, target_amount)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, title, targetAmt]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding goal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;