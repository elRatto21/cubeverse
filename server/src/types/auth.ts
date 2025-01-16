// src/types/auth.ts
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface UserResponse {
    id: string;
    username: string;
    email: string;
  }