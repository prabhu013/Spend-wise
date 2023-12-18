import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Chart from 'chart.js/auto';

const FinanceTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState('');
  const [netWorth, setNetWorth] = useState(0);
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    calculateNetWorth();
    drawGraph();
  }, [transactions]);

  const calculateNetWorth = () => {
    let sum = 0;
    for (let i = 0; i < transactions.length; i++) {
      sum += parseFloat(transactions[i]);
    }
    setNetWorth(sum);
  };

  const addTransaction = () => {
    if (newTransaction !== '') {
      setTransactions([...transactions, newTransaction]);
      setNewTransaction('');
    }
  };

  const deleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  const drawGraph = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartContainerRef.current.getContext('2d');
    const labels = transactions.map((_, index) => `Transaction ${index + 1}`);
    const data = transactions.map((transaction) => parseFloat(transaction));

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Transaction Amount',
            data: data,
            backgroundColor: '#2196f3',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div className="finance-tracker">
      <h1>Finance Tracker</h1>
      <div className="transaction-input">
        <input
          type="text"
          value={newTransaction}
          onChange={(e) => setNewTransaction(e.target.value)}
          placeholder="Enter a new transaction"
        />
        <button onClick={addTransaction}>Add</button>
      </div>
      <div className="net-worth">
        <h3>Net Worth</h3>
        <p>${netWorth.toFixed(2)}</p>
      </div>
      <div className="graph">
        <canvas ref={chartContainerRef}></canvas>
      </div>
      <ul className="transaction-list">
        {transactions.map((transaction, index) => (
          <li key={index} className="transaction-item">
            {transaction}
            <button onClick={() => deleteTransaction(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinanceTracker;
