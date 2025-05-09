// src/pages/home.jsx
import React from "react";
import Particles from "react-tsparticles";
import styles from "./styles/home.module.css"; // CSS Module

export default function HomePage() {
  return (
    <div className={styles.homeContainer}>
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false },
          particles: {
            color: { value: "#60a5fa" },
            links: { enable: true, color: "#60a5fa", distance: 130 },
            move: { enable: true, speed: 1.2 },
            size: { value: { min: 1, max: 3 } },
            number: { value: 90 },
            opacity: { value: 0.4 },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 100 },
              push: { quantity: 4 },
            },
          },
        }}
        className={styles.particles}
      />

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Expense Tracker</h1>
        <p className={styles.subtitle}>
          Easily track your expenses, visualize your spending patterns, and take control of your finances.
        </p>
        <a href="/login" className={styles.button}>
          Get Started
        </a>
      </div>
    </div>
  );
}
