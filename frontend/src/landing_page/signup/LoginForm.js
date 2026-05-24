import React, { useState } from "react";
import BACKEND_URL, { DASHBOARD_URL } from "../../config";
import FormField from "../components/FormField";
import { validateLoginForm } from "./validation";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const { errors: formErrors, isValid } = validateLoginForm(formData);
    setErrors(formErrors);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        setSubmitError("Invalid email or password.");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body.error || "Login failed. Please try again.");
        return;
      }

      window.location.href = DASHBOARD_URL;
    } catch {
      setSubmitError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitError && <div className="alert alert-danger text-center">{submitError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          placeholder="eg. user@example.com"
          error={errors.email}
        />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          wrapperClassName="mb-4"
        />

        <button
          type="submit"
          className="btn btn-primary w-100 mb-3 fw-bold app-signup-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </>
  );
}

export default LoginForm;
