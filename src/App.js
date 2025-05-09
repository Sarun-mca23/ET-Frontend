// src/App.js
import { Routes, Route } from "react-router-dom";
import Navbar from './components/navbar';
import './App.css';
import HomePage from "./pages/home";
import SignupPage from "./pages/signup";
import SigninPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import Deposit from "./pages/DepositPage";
import AddExpenses from "./pages/addExpense"
import TrackExpence from "./pages/trackExpense"
import TransactionHistory from "./pages/TransactionHistory";
import Modal from "./components/modal";
import About from "./pages/AboutPage";
import PrivateRoute from "./components/PrivateRoute";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/Notfound";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<SigninPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/DepositPage" element={<Deposit/>}/>
        <Route path="/addExpense" element={<AddExpenses/>}/>
        <Route path="/trackExpense" element={<TrackExpence/>}/>
        <Route path="/TransactionHistory" element={<TransactionHistory/>}/>
        <Route path="/modal" element={<Modal/>}/>
        <Route path="/AboutPage" element={<About/>}/>
        <Route path="/ContactPage" element={<ContactPage/>}/>
        <Route path="/PrivateRoute" element={<PrivateRoute/>}/>
        <Route component={NotFound} />
      </Routes>
    </>
  );
}

export default App;
