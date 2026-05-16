import { validateSignupForm } from "./validation";

const validForm = {
  fullName: "Test User",
  email: "test@example.com",
  phoneNumber: "9999999999",
  password: "secret123",
  confirmPassword: "secret123",
};

describe("validateSignupForm", () => {
  it("returns isValid:true with no errors for a fully-filled valid form", () => {
    const { errors, isValid } = validateSignupForm(validForm);

    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  it("flags missing fullName", () => {
    const { errors, isValid } = validateSignupForm({ ...validForm, fullName: "" });

    expect(isValid).toBe(false);
    expect(errors.fullName).toBeDefined();
  });

  it("flags missing email", () => {
    const { errors, isValid } = validateSignupForm({ ...validForm, email: "" });

    expect(isValid).toBe(false);
    expect(errors.email).toBe("Email is required");
  });

  it("flags invalid email format", () => {
    const { errors, isValid } = validateSignupForm({
      ...validForm,
      email: "not-an-email",
    });

    expect(isValid).toBe(false);
    expect(errors.email).toBe("Invalid email format");
  });

  it("flags missing password", () => {
    const { errors, isValid } = validateSignupForm({
      ...validForm,
      password: "",
      confirmPassword: "",
    });

    expect(isValid).toBe(false);
    expect(errors.password).toBe("Password is required");
  });

  it("flags password mismatch on confirmPassword", () => {
    const { errors, isValid } = validateSignupForm({
      ...validForm,
      confirmPassword: "different",
    });

    expect(isValid).toBe(false);
    expect(errors.confirmPassword).toBe("Passwords do not match");
  });
});
