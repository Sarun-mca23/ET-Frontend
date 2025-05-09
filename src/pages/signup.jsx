import React, { useState, useEffect } from "react";
import styles from "./styles/signup.module.css";
import { toast } from 'react-toastify';  // Import only toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import toastify CSS

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    dob: "",
    email: "",
    phoneNumber: "",
    password: "",
    bin: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    // Clear error when user starts typing in any of the fields
    setError("");
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const validateBIN = (bin) => {
    const regex = /^\d{4}$/;  // Checks if BIN is exactly 4 digits
    return regex.test(bin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    if (!formData.username || !formData.email || !formData.password || !formData.dob || !formData.bin) {
      setError("All fields are required!");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!formData.dob || new Date(formData.dob) > new Date()) {
      setError("Please enter a valid date of birth.");
      return;
    }

    if (!validateBIN(formData.bin)) {
      setError("BIN must be exactly 4 digits.");
      return;
    }

    // Submit form to backend
    try {
      const response = await fetch('http://localhost:2022/api/auth/signup', {  // adjust URL & port if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      console.log('✅ Signup successful:', data);
      toast.success('Signup successful! You can now log in.');  // Toast notification for success

      // Optionally redirect user to login page after a delay
      setTimeout(() => {
        window.location.href = '/login';  // Redirect to login page
      }, 2000); // Wait 2 seconds before redirecting

    } catch (err) {
      console.error('❌ Signup error:', err);
      toast.error(err.message || 'Something went wrong. Please try again.');  // Toast notification for error
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Sign Up</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="dob" className={styles.label}>
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber" className={styles.label}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={styles.input}
              required
              pattern="[0-9]{10}" // Optional: force exactly 10 digits (India-style)
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="bin" className={styles.label}>
              BIN (4 digits)
            </label>
            <input
              type="text"
              id="bin"
              name="bin"
              value={formData.bin}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign Up
          </button>
          <p className={styles.linkText}>
            Already have an account?{" "}
            <a href="/login" className={styles.link}>Log In</a>
          </p>
        </form>
      </div>
    </div>
  );
}
