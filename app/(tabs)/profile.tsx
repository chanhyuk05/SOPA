import React from 'react';
import { StyleSheet, View } from 'react-native';
import AuthTemplate from '../../src/components/templates/AuthTemplate/AuthTemplate';
import Profile from '../../src/components/templates/Profile/Profile';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ProfileScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  // 로딩 중일 때는 빈 화면 표시
  if (isLoading) {
    return <View style={styles.container} />;
  }

  // 인증된 사용자는 프로필 화면, 인증되지 않은 사용자는 로그인/회원가입
  return isAuthenticated ? (
    <Profile onLogout={() => {}} />
  ) : (
    <AuthTemplate />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});
