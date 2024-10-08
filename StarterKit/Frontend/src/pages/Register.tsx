import React from "react";
import { Link } from "react-router-dom";


const Register = () => {
    return (
        <div>
            <h1>Register</h1>



            <h2>Already have an account?</h2>
            <Link to="/login">Go to Login</Link>
        </div>
    );
};


export default Register;