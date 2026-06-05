import React from "react";
import { useSearchParams } from "react-router-dom";
import BACKEND_URL from "../../config";

const ERROR_MESSAGES = {
  oauth: "Google sign-in failed. Please try again.",
  state: "Your sign-in session expired. Please try again.",
};

function GoogleSignInButton() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const message = error ? ERROR_MESSAGES[error] || ERROR_MESSAGES.oauth : "";

  const handleClick = () => {
    // Full-page navigation to the backend, which redirects to Google's consent
    // screen and, on success, sets the httpOnly auth cookie before returning.
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <>
      {message && <div className="alert alert-danger text-center">{message}</div>}

      <button
        type="button"
        onClick={handleClick}
        className="btn btn-primary w-100 mb-4 fw-bold app-signup-btn"
      >
        Continue with Google
      </button>
    </>
  );
}

export default GoogleSignInButton;
