import React, { useState } from "react";
import { DASHBOARD_URL } from "../../config";
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
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors: formErrors, isValid } = validateSignupForm(formData);
    setErrors(formErrors);
    if (isValid) {
      setSuccessMsg("Signup successful! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = `${DASHBOARD_URL}/?name=${encodeURIComponent(formData.fullName)}`;
      }, 2000);
    }
  };

  return (
    <>
      {successMsg && <div className="alert alert-success text-center">{successMsg}</div>}

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

        <button type="submit" className="btn btn-primary w-100 mb-3 fw-bold app-signup-btn">
          Sign up
        </button>
      </form>
    </>
  );
}

export default SignupForm;
