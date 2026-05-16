const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignupForm(values) {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = "Full name is required";

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
  if (!values.password) errors.password = "Password is required";
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
