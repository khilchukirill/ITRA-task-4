import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home/homePage";
import { Registration, Auth } from "./components";
import { AdminPanel} from "./pages/adminPanel/adminPanel";
import { ProtectedRoutes } from "./utils/protectedRoutes";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signIn" element={<Auth />} />
          <Route path="/signUp" element={<Registration />} />
          <Route
            path="/adminPanel"
            element={
              <ProtectedRoutes>
                <AdminPanel />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
