import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './styles/dashboard.module.css';
import Modal from '../components/modal'; // Ensure this is the correct import path
import { jwtDecode } from "jwt-decode"; // Corrected import
import { toast } from "react-toastify"; // Using toast for better error handling

export default function Dash() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState(false);
  const [binInput, setBinInput] = useState('');
  const [pendingRoute, setPendingRoute] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("UserToken");

    if (!storedToken) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(storedToken); // Using jwt-decode for decoding
    } catch (error) {
      console.error("Invalid token format:", error);
      toast.error("Invalid token. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:2022/api/user/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
    
        const userData = await response.json();
        if (!userData || !userData.email) {
          throw new Error('Invalid user data');
        }
    
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        toast.error("Failed to load user data. Please login again.");
        localStorage.clear();
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    

    fetchUserDetails();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading user details...</div>;
  }

  if (!user) {
    localStorage.clear();
    navigate("/login");
    return null;
  }

  const handleProtectedNavigation = (route) => {
    setPendingRoute(route);
    setModel(true); // Show the modal
  };

  const verifyBinAndNavigate = (inputBin) => {
    setModel(false); // Close modal after verification

    if (inputBin === user.bin.trim()) {
      navigate(pendingRoute); // Navigate to the correct route
    } else {
      toast.error('Invalid BIN. Please try again.');
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.topBar}>
        <div className={styles.topLinks}>
          <a href="/addExpense" className={styles.topLink}>Add Expenses</a>
          <a
            href="#"
            className={styles.topLink}
            onClick={(e) => {
              e.preventDefault();
              handleProtectedNavigation('/trackExpense');
            }}
          >
            Track Expenses
          </a>
          <a href="/DepositPage" className={styles.topLink}>Transactions</a>
          <a
            href="#"
            className={styles.topLink}
            onClick={(e) => {
              e.preventDefault();
              handleProtectedNavigation('/TransactionHistory');
            }}
          >
            History
          </a>
        </div>
        <div className={styles.welcomeText}>Welcome, {user.username || "User"}</div>
      </div>

      <div className={styles.dashContainer}>
        <div className={styles.dashInfo}>
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Phone:</strong> {user.phoneNumber || "N/A"}</p>
          <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString() || "N/A"}</p>
          <p><strong>Account Balance:</strong> ₹{user.balance || 0}</p>
        </div>

        <button
          className={styles.btnDash}
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Show Modal if triggered */}
      
      {model && (
        <Modal
          binInput={binInput}
          setBinInput={setBinInput}
          onSuccess={() => verifyBinAndNavigate(binInput)}
          setModel={setModel}
          userBin={user.bin}
        />
      )}
      
    </div>
  );
}
