import React from "react";
import { Link } from "react-router-dom";
import GoogleSignInButton from "./GoogleSignInButton";

function LoginHeader() {
  return (
    <>
      <h2 className="text-center mb-4">Log in</h2>
      <p className="text-center text-muted mb-4">Welcome back to Zerodha.</p>
    </>
  );
}

function LoginFooter() {
  return (
    <div className="text-center">
      <small className="text-muted">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </small>
    </div>
  );
}

function Login() {
  return (
    <div className="container mt-5 mb-5 p-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 p-4 rounded shadow-sm signup-box">
          <LoginHeader />
          <GoogleSignInButton />
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}

export default Login;
