import React from "react";
import { toast } from "react-toastify";
import style from './modal.module.css';

const Modal = ({ binInput, setBinInput, onSuccess, setModel, userBin }) => {

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userBin) {
      toast.error("User BIN is missing.");
      return;
    }

    if (binInput === userBin.trim()) {   // ONLY compare here
      onSuccess();                        // Let parent handle what happens next
      setModel(false);
    } else {
      toast.error("Invalid BIN. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    setBinInput(e.target.value);
  };
  return (
    <div className={style.modal}>
  <div className={style.modalContent}>
    <form onSubmit={handleSubmit}>
      <label>Enter BIN</label>
      <input
        type="text"
        value={binInput}
        onChange={handleInputChange}
        className={style.inputField}
      />
      <div className={style.modalButtons}>
        <button type="submit" className={style.submitButton}>Submit</button>
        <button type="button" onClick={() => setModel(false)} className={style.cancelButton}>Cancel</button>
      </div>
    </form>
  </div>
</div>

  );
};

export default Modal;
