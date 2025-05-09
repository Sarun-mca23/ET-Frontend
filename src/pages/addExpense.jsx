import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from './styles/addExpense.module.css';
import Modal from '../components/modal';

const AddExpensePage = () => {
  const [token, setToken] = useState(null);
  const [balance, setBalance] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food'); // Removed emoji for better compatibility
  const [amount, setAmount] = useState(''); // Treating amount as a string for input
  const [model, setModel] = useState(false);
  const [binInput, setBinInput] = useState('');
  const [userBin, setUserBin] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('UserToken');
    if (!storedToken) {
      toast.error('Please login first.', { className: 'toast-error' });
      navigate('/');
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:2022/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        setBalance(userData.balance);
        setUserBin(userData.bin);
        setUserEmail(userData.email); // Fetch and set the user's email
        console.log('Fetched profile:', userData);

      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response && error.response.status === 401) {
          toast.error('Session expired. Please log in again.');
          navigate('/');
        } else {
          toast.error('Failed to fetch profile.');
        }
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const verifyBinAndNavigate = () => {
    if (binInput === userBin) {
      addExpenseToDatabase(Number(amount));
      setModel(false);
    } else {
      toast.error('⚠️ Invalid Bin. Please try again.', { className: 'toast-error' });
      setBinInput('');
    }
  };

  const addExpenseToDatabase = async (expenseAmount) => {
    if (expenseAmount <= 0) {
      toast.error('🎆 Enter a valid amount', { className: 'toast-error' });
      return;
    }
  
    if (expenseAmount > balance) {
      toast.error('⚠️ You don’t have enough balance for this expense.', { className: 'toast-error' });
      return;
    }
  
    if (!description || !category || !expenseAmount || !userEmail) {
      toast.error('⚠️ Please provide all required fields.', { className: 'toast-error' });
      return;
    }
  
    const newBalance = balance - expenseAmount;
  
    try {
      setIsLoading(true);
  
      // Log the request data before sending
      console.log({
        description,
        category,
        amount: expenseAmount,
        email: userEmail,
      });
  
      // Send the request with the expense details and email
      await axios.post(
        'http://localhost:2022/api/expenses/add',
        {
          description,
          category,
          amount: expenseAmount,
          email: userEmail, // Send email instead of userId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Send email (backend handles sending the email)
      toast.success('Expense added, balance updated, and email sent!', { className: 'toast-success' });
  
      // Update balance after adding expense
      await axios.post(
        'http://localhost:2022/api/user/updateBalance',
        { balance: newBalance },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setBalance(newBalance);
      setDescription('');
      setCategory('Food'); // Reset to Food without emoji
      setAmount(''); // Reset amount
      setBinInput('');
      setModel(false); // Close modal after success
    } catch (err) {
      console.error('Error during adding expense:', err.response ? err.response.data : err.message);
      toast.error('Failed to add expense or update balance.', { className: 'toast-error' });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div>
      <div className={style.Deposite}>
        <div className={style.DepositeContainer}>
          <div className={style.brandLogoD}></div>
          <center><div className={style.Title}>Add Expense</div></center>

          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Current Balance: <span> ₹ {balance}</span>
          </p>

          <div className={style.inputs}>
            <div className={style.inputWrapper}>
              <label><b>Description</b></label>
              <input
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className={style.inputWrapper}>
              <label><b>Category</b></label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Food">Food</option>
                <option value="Dress">Dress</option>
                <option value="Movie">Movie</option>
                <option value="Transport">Transport</option>
                <option value="Home">Home</option>
                <option value="Rent">Rent</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className={style.inputWrapper}>
              <label><b>Amount</b></label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
            </div>

            <div className={style.buttonContainer}>
              <button
                type="button"
                onClick={() => setModel(true)}
                className={style.depositBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>

      {model && userBin && (
        <Modal
          binInput={binInput}
          setBinInput={setBinInput}
          onSuccess={verifyBinAndNavigate}
          setModel={setModel}
          userBin={userBin}
        />
      )}
    </div>
  );
};

export default AddExpensePage;
