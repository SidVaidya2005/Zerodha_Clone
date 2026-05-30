import React, { useState } from "react";
import BACKEND_URL, { DASHBOARD_URL } from "../../config";
import FormField from "../components/FormField";
import { validateSignupForm } from "./validation";

function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const { errors: formErrors, isValid } = validateSignupForm(formData);
    setErrors(formErrors);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });

      if (res.status === 409) {
        setErrors({ email: "An account with this email already exists" });
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body.error || "Signup failed. Please try again.");
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
          id="fullName"
          name="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="eg. John Doe"
          error={errors.fullName}
        />
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
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="eg. 9876543210"
          error={errors.phoneNumber}
        />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          wrapperClassName="mb-4"
        />

        <button
          type="submit"
          className="btn btn-primary w-100 mb-3 fw-bold app-signup-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up…" : "Sign up"}
        </button>
      </form>
    </>
  );
}

export default SignupForm;
