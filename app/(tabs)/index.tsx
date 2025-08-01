import React from 'react';
import { StyleSheet, View } from 'react-native';
import AuthTemplate from '../../src/components/templates/AuthTemplate/AuthTemplate';
import ReservationTemplate from '../../src/components/templates/ReservationTemplate/ReservationTemplate';
import { useAuth } from '../../src/contexts/AuthContext';

export default function HomeScreen() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // 로딩 중일 때는 빈 화면 표시
  if (isLoading) {
    return <View style={styles.container} />;
  }

  // 인증된 사용자는 예약 시스템, 인증되지 않은 사용자는 로그인/회원가입
  return isAuthenticated && user ? (
    <ReservationTemplate user={user} />
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
