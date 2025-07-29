// 인증 관련 타입들

export interface AuthUser {
  id: string;
  studentId: string; // 5자리 학번
  name: string;
  email?: string;
  grade: 1 | 2 | 3;
  role: 'student' | 'sub-admin' | 'super-admin';
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginRequest {
  studentId: string;
  password: string;
}

export interface RegisterRequest {
  studentId: string;
  name: string;
  email?: string;
  password: string;
  confirmPassword: string;
  grade: 1 | 2 | 3;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  clearError: () => void;
}
