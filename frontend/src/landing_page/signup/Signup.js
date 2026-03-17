import React from "react";
import SignupForm from "./SignupForm";

function SignupHeader() {
  return (
    <>
      <h2 className="text-center mb-4">Sign up now</h2>
      <p className="text-center text-muted mb-4">
        Or track your existing application.
      </p>
    </>
  );
}

function SignupFooter() {
  return (
    <div className="text-center">
      <small className="text-muted">
        By submitting your details, you agree to our Terms and Conditions.
      </small>
    </div>
  );
}

function Signup() {
  return (
    <div className="container mt-5 mb-5 p-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 p-4 rounded shadow-sm signup-box">
          <SignupHeader />
          <SignupForm />
          <SignupFooter />
        </div>
      </div>
    </div>
  );
}

export default Signup;
