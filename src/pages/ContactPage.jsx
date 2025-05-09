import React, { useState } from 'react';
import { FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';  // Correctly import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import styles from './styles/contact.module.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send('service_llnw974', 'template_5phac9k', formData, '5I1I1F0KUgJCCG49j')
      .then((result) => {
        console.log(result.text);
        toast.success('✅ Message sent successfully!');  // Toast success message
        setFormData({ name: '', email: '', message: '' }); // Clear form
      }, (error) => {
        console.error(error.text);
        toast.error('❌ Failed to send message. Please try again.');  // Toast error message
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Get in Touch</h1>
      <p className={styles.subText}>
        I'd love to hear from you! Feel free to reach out through any of the platforms below or send me a direct message.
      </p>

      {/* Social Links */}
      <div className={styles.socialLinks}>
        <a href="https://wa.me/9003837118" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="WhatsApp">
          <FaWhatsapp />
        </a>
        <a href="https://www.instagram.com/iim_sarun?igsh=YnNvNzJ5Zmx2amFn" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Instagram">
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com/in/sarun11?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="LinkedIn">
          <FaLinkedin />
        </a>
      </div>

      {/* Email Section */}
      <div className={styles.emailSection}>
        <p>You can also email me at:</p>
        <a href="mailto:sarunkumar170103@gmail.com" className={styles.emailLink}>
          sarunkumar170103@gmail.com
        </a>
      </div>

      {/* Form Section */}
      <div className={styles.formSection}>
        <h3 className={styles.formHeading}>Or send me a message</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className={styles.inputField}
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className={styles.inputField}
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
            className={styles.textareaField}
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button type="submit" className={styles.submitButton}>Send Message</button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer /> {/* Correct ToastContainer usage */}
    </div>
  );
};

export default ContactPage;
