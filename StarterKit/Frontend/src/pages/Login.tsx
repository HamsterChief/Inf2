import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <h1>Login Page</h1>



      <h2>Dont have an account?</h2>
      <Link to="/register">Go to Login</Link>
    </div>
  );
};

export default Login;