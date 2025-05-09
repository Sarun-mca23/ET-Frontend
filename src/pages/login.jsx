import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles/login.module.css"; // Your CSS module

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when submitting

    try {
      const response = await axios.post("http://localhost:2022/api/auth/login", {
        email,
        password,
      });

      // Check if the response contains a token
      if (response.data.token) {
        // Save the token in localStorage
        localStorage.setItem("UserToken", response.data.token);

        // Log the token to ensure it's saved correctly
        console.log("Token saved:", response.data.token);

        // Notify the user of successful login
        toast.success("Login successful!");

        // Fetch user profile data after login using the saved token
        const token = localStorage.getItem('UserToken');
        const profileResponse = await axios.get("http://localhost:2022/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,  // Send token in headers for authentication
          },
        });

        // Log the profile data (including userId)
        console.log("Profile data:", profileResponse.data);

        // Navigate to the dashboard page
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000); // Redirect after 1 second to show success toast
      }
    } catch (error) {
      // If error occurs, show the appropriate error message
      if (error.response) {
        toast.error(error.response.data.message || "Login failed. Try again later.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading when finished
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Log In</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              pattern="^[^@]+@[^@]+\.[^@]+$"
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className={styles.linkText}>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className={styles.link}>Sign up here</Link>
        </p>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default LoginPage;
