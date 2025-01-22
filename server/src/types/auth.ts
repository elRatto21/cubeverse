// src/types/auth.ts
export interface RegisterRequest {
    username: string;
    password: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface UserResponse {
    id: string;
    username: string;
  }