import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx"; // Import your AuthContext

const INACTIVITY_LIMIT = 15 * 60 * 100000; // 15 minutes (adjust as needed)
// const INACTIVITY_LIMIT = 2 * 1000; // 2 seconds

const AutoLogoutProvider = ({ children }) => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useAuth(); // Use logout from context

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  const handleLogout = useCallback(() => {
    logout(); // call your context logout (which clears localStorage and sets isLoggedIn false)
    navigate("/login");
  }, [logout, navigate]);

  useEffect(() => {
    if (!isLoggedIn) return; // only track if user is logged in

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
    const handleActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_LIMIT) {
        handleLogout();
      }
    }, 1000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [lastActivity, handleLogout, resetTimer, isLoggedIn]);

  return <>{children}</>;
};

export default AutoLogoutProvider;
