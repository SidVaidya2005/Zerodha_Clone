import React from "react";
import { Link } from "react-router-dom";

function SignupCTAButton() {
  return (
    <Link to="/signup" className="p-2 btn btn-primary fs-5 mb-5 app-cta-button">
      Signup Now
    </Link>
  );
}

export default SignupCTAButton;
