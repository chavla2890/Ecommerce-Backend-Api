import { REGEX, VALIDATION } from "../constants/validation";
import type { RegisterPayload, FieldError } from "../types/auth.types";

export function validateRegisterForm(values: RegisterPayload): FieldError[] {
  const errors: FieldError[] = [];

  const name = values.name.trim();

  if (!name) {
    errors.push({ field: "name", message: "Name Is Required" });
  } else if (name.length < VALIDATION.name.min) {
    errors.push({
      field: "name",
      message: `Name Must Be At Least ${VALIDATION.name.min} Characters`,
    });
  } else if (name.length > VALIDATION.name.max) {
    errors.push({
      field: "name",
      message: `Name Must Be Less Than ${VALIDATION.name.max} Characters`,
    });
  }

  // Email
  const email = values.email.trim();
  if (!email) {
    errors.push({ field: "email", message: "Email Is Required." });
  } else if (email.length < VALIDATION.email.min) {
    errors.push({
      field: "email",
      message: `Email must be at least ${VALIDATION.email.min} characters.`,
    });
  } else if (email.length > VALIDATION.email.max) {
    errors.push({
      field: "email",
      message: `Email must be at most ${VALIDATION.email.max} characters.`,
    });
  } else if (!REGEX.EMAIL.test(email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address.",
    });
  }

  // Password
  const password = values.password;
  if (!password) {
    errors.push({ field: "password", message: "Password is required." });
  } else if (password.length < VALIDATION.password.min) {
    errors.push({
      field: "password",
      message: `Password must be at least ${VALIDATION.password.min} characters.`,
    });
  } else if (password.length > VALIDATION.password.max) {
    errors.push({
      field: "password",
      message: `Password must be at most ${VALIDATION.password.max} characters.`,
    });
  } else if (!REGEX.PASSWORD.test(password)) {
    errors.push({
      field: "password",
      message:
        "Password must include uppercase, lowercase, number, and special character.",
    });
  }

  return errors;
}

export function getPasswordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
}
