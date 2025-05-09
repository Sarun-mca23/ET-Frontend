// src/pages/TransactionPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import style from "./styles/deposit.module.css";
import Model from "../components/modal";

const TransactionPage = () => {
  const [token, setToken] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [actionType, setActionType] = useState(""); // "deposit" or "withdraw"
  const [binInput, setBinInput] = useState(""); // State for BIN input in the modal
  const navigate = useNavigate();

  // Fetch stored token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("UserToken");
    if (!storedToken) {
      toast.error("Session expired. Please log in again.", { className: "toast-error" });
      navigate("/");
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  // Fetch user profile when token is available
  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:2022/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched user profile:", res.data);  // ✅ Print profile details
        setUserData(res.data);
        setBalance(Number(res.data.balance));
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.", { className: "toast-error" });
          navigate("/");
        } else {
          toast.error("Failed to fetch user profile.", { className: "toast-error" });
        }
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  // Common transaction handler (deposit/withdraw)
  const initiateTransaction = (type) => {
    const transactionAmount = Number(amount);

    if (!amount || isNaN(transactionAmount) || transactionAmount <= 0) {
      toast.error("🎆 Enter a valid amount", { className: "toast-error" });
      return;
    }

    if (type === "withdraw" && transactionAmount > balance) {
      toast.error("❌ Insufficient balance!", { className: "toast-error" });
      return;
    }

    setActionType(type);
    setShowModal(true); // Open modal for BIN verification
  };

  const handleConfirmedTransaction = async () => {
    const transactionAmount = Number(amount);

    console.log("Confirmed Transaction:", actionType, "Amount:", transactionAmount);

    try {
      const res = await axios.post(
        `http://localhost:2022/api/user/${actionType}`,   // ✅ No userId in URL anymore
        { amount: transactionAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        setBalance(res.data.balance);  // Update balance from server
        toast.success(`${capitalize(actionType)} successful!`, {
          className: "toast-success",
        });
        setAmount("");
      } else {
        toast.error(res.data.message || `Failed to ${actionType}`, {
          className: "toast-error",
        });
      }
    } catch (err) {
      console.error(`Error during ${actionType}:`, err);
      const errorMessage = err.response?.data?.message || `Failed to ${actionType}. Try again later.`;
      toast.error(errorMessage, { className: "toast-error" });
    } finally {
      setShowModal(false);
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const back = () => {
    navigate("/dashboard");
  };

  return (
    <div className={style.Deposite}>
      <div className={style.DepositeContainer}>
        <div className={style.brandLogoD}></div>
        <center>
          <div className={style.Title}>Transaction</div>
        </center>

        <p style={{ textAlign: "center", fontWeight: "bold" }}>
          Current Balance: ₹ {balance}
        </p>

        <div className={style.inputs}>
          <label><b>AMOUNT</b></label>
          <input
            type="number"
            placeholder="ENTER YOUR AMOUNT"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />

          <div className={style.buttonRow}>
            <button type="button" onClick={() => initiateTransaction("deposit")} className={style.depositBtn}>
              Deposit
            </button>
            <button type="button" onClick={() => initiateTransaction("withdraw")} className={style.withdrawBtn}>
              Withdraw
            </button>
          </div>

          <button type="button" onClick={back} className={style.withdrawBtn}>
            Back
          </button>
        </div>
      </div>

      <ToastContainer />

      {showModal && userData && (
        <Model
          setModel={setShowModal}
          userBin={userData.bin}
          binInput={binInput}
          setBinInput={setBinInput}
          onSuccess={handleConfirmedTransaction}
        />
      )}
    </div>
  );
};

export default TransactionPage;
