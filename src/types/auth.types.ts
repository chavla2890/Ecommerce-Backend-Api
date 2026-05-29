export type UserRole = "USER" | "SELLER";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}


export interface FieldError {
    field: keyof RegisterPayload;
    message: string;
}