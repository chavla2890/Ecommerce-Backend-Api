import { API_BASE_URL } from "@/src/constants/validation";
import type {
  RegisterPayload,
  RegisterResponse,
  ApiResponse,
} from "@/src/types/auth.types";

export async function registerUser(
  payload: RegisterPayload,
): Promise<ApiResponse<RegisterResponse>> {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse<RegisterResponse> = await response.json();

  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function registerSeller(
  payload: RegisterPayload,
): Promise<ApiResponse<RegisterResponse>> {
  const res = await fetch(`${API_BASE_URL}/user/register-seller`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse<RegisterResponse> = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
}
