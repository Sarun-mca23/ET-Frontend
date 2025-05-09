import React from 'react';
import styles from './styles/about.module.css';
import myImage from './assets/me.jpg'; // Correct way to import the image

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <section className={styles.introduction}>
        <h1>Welcome to My Project</h1>
        <p>
          This project represents our dedication to creating cutting-edge digital solutions for everyday problems.
          We aim to streamline processes and improve user experience by building innovative applications.
        </p>
      </section>

      <section className={styles.projectDetails}>
        <h2>Project Overview</h2>
        <div className={styles.details}>
          <div className={styles.textSection}>
            <h3>Our Vision</h3>
            <p>
              Our goal is to empower individuals and businesses by providing them with intuitive tools to manage their
              expenses, tasks, and more. With a user-centric approach, we have designed this project to offer seamless
              functionality and accessibility across all platforms.
            </p>
          </div>

          <div className={styles.techSection}>
            <h3>Technology Stack</h3>
            <ul>
              <li>Frontend: React, CSS Modules, JavaScript</li>
              <li>Backend: Node.js, Express</li>
              <li>Database: MongoDB</li>
              <li>PDF Generation: jsPDF</li>
              <li>Version Control: Git, GitHub</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.aboutMe}>
        <h2>About Me</h2>
        <div className={styles.meDetails}>
          <div className={styles.photo}>
            <img src={myImage} alt="Your Name" /> {/* Correct way to reference imported image */}
          </div>
          <div className={styles.text}>
            <p>
              Hello, I’m Sarunkumar, the creator behind this project. I’m passionate about web development and love
              creating efficient, user-friendly applications that solve real-world problems.
            </p>
            <p>
              With experience in both frontend and backend development, I’ve worked on various projects that enhance
              productivity and streamline everyday processes. This project is a culmination of my skills in JavaScript,
              React, and backend technologies.
            </p>
            <p>
              I believe that great design and thoughtful user experience are key to creating successful applications.
              Thank you for visiting and I hope you enjoy the result of this hard work.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contact}>
        <h2>Get in Touch</h2>
        <p>
          If you have any questions or would like to collaborate, feel free to reach out! You can contact me via email
          at sarunkumar170103@gmail.com.
        </p>
      </section>

      {/* Add the Copyright Section */}
      <footer className={styles.footer}>
        <p>&copy; 2025 Sarunkumar. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
