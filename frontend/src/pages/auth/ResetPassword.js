import React from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  return (
    <div>
      <h1>Here we'll have a form to enter your email to reset the password.</h1>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default ResetPassword;
