import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LogIn from '../Components/LogIn';
import Sing_In from '../Components/Sing_In';
import Dashboard from '../Components/Dashboard';
import ReportViewer from '../Components/ReportViewer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleSignup = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return (
      <Router>
        <div>
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard token={token} user={user} onLogout={handleLogout} />} 
            />
            <Route 
              path="/report/:reportId" 
              element={<ReportViewer />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    );
  }

  return (
    <div>
      {showSignup ? (
        <Sing_In 
          onSignup={handleSignup} 
          onSwitchToLogin={() => setShowSignup(false)} 
        />
      ) : (
        <LogIn 
          onLogin={handleLogin} 
          onSwitchToSignup={() => setShowSignup(true)} 
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
