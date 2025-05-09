import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/trackExpence.module.css';
import { format, isSameDay } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // <--- This registers autoTable into jsPDF
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expenses and sort by most recent first
  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('UserToken');
      if (!token) {
        toast.error('Please log in to view your expenses.');
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile to get email
        const profileResponse = await axios.get('http://localhost:2022/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userEmail = profileResponse.data.email;

        // Fetch expenses for the user by email
        const response = await axios.get(
          `http://localhost:2022/api/expenses/byEmail?email=${userEmail}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExpenses(response.data);
        setFilteredExpenses(response.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to fetch expenses.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Apply filters (date, category)
  useEffect(() => {
    let updatedExpenses = [...expenses];

    if (selectedDate) {
      const selected = new Date(selectedDate);
      updatedExpenses = updatedExpenses.filter(expense =>
        isSameDay(new Date(expense.createdAt), selected)
      );
    }

    if (categoryFilter) {
      updatedExpenses = updatedExpenses.filter(
        expense => expense.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredExpenses(updatedExpenses);
  }, [expenses, selectedDate, categoryFilter]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const clearFilters = () => {
    setSelectedDate('');
    setCategoryFilter('');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text('Expenses Report', 14, 15);

    const tableColumn = ["Date", "Description", "Category", "Amount"];

    const tableRows = filteredExpenses.map(expense => {
      const createdAtDate = new Date(expense.createdAt);

      // Check if the date is valid
      const formattedDate = isNaN(createdAtDate)
        ? 'Invalid Date'
        : format(createdAtDate, 'MMM dd, yyyy');

      return [
        formattedDate,
        expense.description || 'N/A',  // Handle missing description
        expense.category || 'N/A',     // Handle missing category
        `$${expense.amount ? Number(expense.amount).toFixed(2) : '0.00'}` // Handle missing amount
      ];
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      margin: { horizontal: 10 },
      styles: {
        fontSize: 10,
        cellPadding: 2,
        halign: 'center',
      },
    });

    doc.save('expenses_report.pdf');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <h1>Expenses</h1>

        {/* Filter Controls */}
        <div className={styles.filtersWrapper}>
          <div className={styles.filterGroup}>
            <label htmlFor="dateFilter">Filter by Date:</label>
            <input
              id="dateFilter"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="categoryFilter">Filter by Category:</label>
            <select id="categoryFilter" value={categoryFilter} onChange={handleCategoryChange}>
              <option value="">-- Select --</option>
              <option value="food">Food</option>
              <option value="movie">Movie</option>
              <option value="transport">Transport</option>
              <option value="home">Home</option>
              <option value="rent">Rent</option>
              <option value="dress">Dress</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.clearBtn} onClick={clearFilters}>
              Clear Filters
            </button>

            <button className={styles.downloadBtn} onClick={downloadPDF}>
              Download PDF
            </button>
          </div>

        </div>

        {/* Expense Table */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => {
                const createdAtDate = new Date(expense.createdAt);
                const formattedDate = isNaN(createdAtDate)
                  ? 'Invalid Date'
                  : format(createdAtDate, 'MMM dd, yyyy');
                return (
                  <tr key={expense._id}> {/* Changed to expense._id as key */}
                    <td>{formattedDate}</td>
                    <td>{expense.description || 'N/A'}</td>
                    <td>{expense.category || 'N/A'}</td>
                    <td>${expense.amount ? Number(expense.amount).toFixed(2) : '0.00'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No expenses found.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExpenseTable;
