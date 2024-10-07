
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {

  return (
    <div className="container px-5 my-5">
      <h1>Welcome to the Web development Starter kit!</h1>
      <Link to="/login">Go to Login</Link>
    </div >
  );
}
