const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
  if (!value) return "Email is required";
  if (!EMAIL_REGEX.test(value)) return "Invalid email format";
  return null;
}

export function validateSignupForm(values) {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = "Full name is required";

  const emailErr = validateEmail(values.email);
  if (emailErr) errors.email = emailErr;

  if (!values.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export function validateLoginForm(values) {
  const errors = {};

  const emailErr = validateEmail(values.email);
  if (emailErr) errors.email = emailErr;

  if (!values.password) errors.password = "Password is required";

  return { errors, isValid: Object.keys(errors).length === 0 };
}
