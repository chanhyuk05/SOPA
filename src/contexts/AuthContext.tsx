import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthContextType, AuthState, AuthUser, LoginRequest, RegisterRequest } from '../types/auth';

// 초기 상태
const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// 액션 타입
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

// 리듀서
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null };
    default:
      return state;
  }
};

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 임시 사용자 데이터 (실제로는 서버에서 관리)
const TEMP_USERS: (AuthUser & { password: string })[] = [
  {
    id: '1',
    studentId: '12345',
    name: '홍길동',
    email: 'hong@example.com',
    grade: 2,
    role: 'student',
    password: '123456',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    studentId: '99999',
    name: '관리자',
    email: 'admin@example.com',
    grade: 3,
    role: 'super-admin',
    password: 'admin123',
    createdAt: '2025-01-01T00:00:00Z',
  },
];

// 프로바이더 컴포넌트
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 앱 시작 시 저장된 사용자 정보 로드
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('auth_user');
      if (storedUser) {
        const user: AuthUser = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Failed to load stored user:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (data: LoginRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // 임시 로그인 로직 (실제로는 서버 API 호출)
      const user = TEMP_USERS.find(
        u => u.studentId === data.studentId && u.password === data.password
      );

      if (!user) {
        throw new Error('학번 또는 비밀번호가 잘못되었습니다.');
      }

      const authUser: AuthUser = {
        id: user.id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        grade: user.grade,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: new Date().toISOString(),
      };

      // 로컬 저장소에 저장
      await AsyncStorage.setItem('auth_user', JSON.stringify(authUser));
      
      dispatch({ type: 'SET_USER', payload: authUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const register = async (data: RegisterRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // 유효성 검사
      if (data.password !== data.confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      if (data.password.length < 6) {
        throw new Error('비밀번호는 6자리 이상이어야 합니다.');
      }

      // 중복 학번 확인
      const existingUser = TEMP_USERS.find(u => u.studentId === data.studentId);
      if (existingUser) {
        throw new Error('이미 등록된 학번입니다.');
      }

      // 새 사용자 생성
      const newUser: AuthUser = {
        id: Date.now().toString(),
        studentId: data.studentId,
        name: data.name,
        email: data.email,
        grade: data.grade,
        role: 'student',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      // 임시 저장 (실제로는 서버에 저장)
      TEMP_USERS.push({ ...newUser, password: data.password });

      // 로컬 저장소에 저장
      await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
      
      dispatch({ type: 'SET_USER', payload: newUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_user');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!state.user) return;

    try {
      const updatedUser = { ...state.user, ...data };
      await AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '프로필 업데이트에 실패했습니다.' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
