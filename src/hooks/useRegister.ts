import { useState } from "react";
import { registerUser, registerSeller } from "@/src/services/auth.service";
import { validateRegisterForm } from "@/src/utils/validation";
import type {
  RegisterPayload,
  FieldError,
  UserRole,
} from "@/src/types/auth.types";

interface UseRegisterReturn {
  loading: boolean;
  success: boolean;
  serverError: string | null;
  fieldErrors: Record<string, string>;
  submit: (values: RegisterPayload, role: UserRole) => Promise<void>;
}

export function useRegister(): UseRegisterReturn {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(values: RegisterPayload, role: UserRole) {
    setServerError(null);
    setFieldErrors({});

    // Client-side validation first (mirrors backend)
    const errors = validateRegisterForm(values);
    if (errors.length > 0) {
      const map: Record<string, string> = {};
      errors.forEach((e: FieldError) => {
        map[e.field] = e.message;
      });
      setFieldErrors(map);
      return;
    }

    setLoading(true);
    try {
      const fn = role === "SELLER" ? registerSeller : registerUser;
      await fn(values);
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as {
        message?: string | string[];
        statusCode?: number;
      };
      if (apiError?.message) {
        const msg = Array.isArray(apiError.message)
          ? apiError.message[0]
          : apiError.message;
        setServerError(msg);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return { loading, success, serverError, fieldErrors, submit };
}
