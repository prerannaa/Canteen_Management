import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initiateLogin = async () => {
      // Delay for 2 seconds to simulate data fetching
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Check if user is already authenticated before initiating redirect
      if (!window.localStorage.getItem('isAuthenticated')) {
        loginWithRedirect();
      } else {
        navigate('/dashboard');
      }

      setIsLoading(false);
    };

    initiateLogin();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    // Optional: Inform user they are already logged in (if applicable)
    <div></div>
  );
};

export default Login;
