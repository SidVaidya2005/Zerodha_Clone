import React from "react";
import { GOOGLE_AUTH_URL } from "../../config";

function SignupCTAButton() {
  return (
    <a href={GOOGLE_AUTH_URL} className="p-2 btn btn-primary fs-5 mb-5 app-cta-button">
      Signup Now
    </a>
  );
}

export default SignupCTAButton;
