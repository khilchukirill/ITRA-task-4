import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import { HomePage } from "./pages/home/homePage";
import { Auth } from "./components/auth/auth";
import { Registration } from "./components";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/SignIn" element={<Auth />} />
          <Route path="/SignUp" element={<Registration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
