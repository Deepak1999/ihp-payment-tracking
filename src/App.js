import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Payment from './components/Home/Payment';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Suspense from './components/Home/Suspense';
import SuspenseAdjustment from './components/Home/SuspenseAdjustment';
import Report from './components/Home/Report';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  return (
    <Router>
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        <Route
          path="/home"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Payment />
            </PrivateRoute>
          }
        />
        <Route
          path="/suspense"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Suspense />
            </PrivateRoute>
          }
        />
        <Route
          path="/spnc-adj"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <SuspenseAdjustment />
            </PrivateRoute>
          }
        />
        <Route
          path="/report"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Report />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
