import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import LoginForm from '../LoginForm/LoginForm';
import Profile from '../Profile/Profile';
import RegisterForm from '../RegisterForm/RegisterForm';

type AuthScreen = 'login' | 'register' | 'profile';

const AuthTemplate: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

  // 로딩 중이면 아무것도 렌더링하지 않음
  if (isLoading) {
    return <View style={styles.container} />;
  }

  // 인증된 사용자는 프로필 화면
  if (isAuthenticated) {
    return (
      <Profile 
        onLogout={() => setCurrentScreen('login')}
      />
    );
  }

  // 인증되지 않은 사용자는 로그인/회원가입 화면
  switch (currentScreen) {
    case 'register':
      return (
        <RegisterForm 
          onSwitchToLogin={() => setCurrentScreen('login')}
        />
      );
    case 'login':
    default:
      return (
        <LoginForm 
          onSwitchToRegister={() => setCurrentScreen('register')}
        />
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});

export default AuthTemplate;
