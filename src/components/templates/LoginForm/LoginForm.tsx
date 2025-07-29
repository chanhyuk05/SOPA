import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AuthContext';
import { userUtils } from '../../../utils/reservation';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Text from '../../atoms/Text/Text';
import Card from '../../molecules/Card/Card';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      Alert.alert('오류', '학번과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (!userUtils.validateStudentId(studentId)) {
      Alert.alert('오류', '학번은 5자리 숫자여야 합니다.');
      return;
    }

    try {
      await login({ studentId: studentId.trim(), password: password.trim() });
    } catch (err) {
      // 에러는 AuthContext에서 처리됨
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('로그인 실패', error);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h1" weight="bold" style={styles.title}>
              합주실 예약 시스템
            </Text>
            <Text variant="body" color="#8E8E93" style={styles.subtitle}>
              학번과 비밀번호로 로그인하세요
            </Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text variant="body" weight="medium" style={styles.label}>
                  학번 (5자리)
                </Text>
                <Input
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="12345"
                  keyboardType="numeric"
                  maxLength={5}
                  variant="outlined"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text variant="body" weight="medium" style={styles.label}>
                  비밀번호
                </Text>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호를 입력하세요"
                  secureTextEntry
                  variant="outlined"
                  autoCapitalize="none"
                />
              </View>

              <Button
                title={isLoading ? "로그인 중..." : "로그인"}
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.loginButton}
              />

              <View style={styles.registerSection}>
                <Text variant="body" color="#8E8E93">
                  계정이 없으신가요?{' '}
                </Text>
                <Button
                  title="회원가입"
                  variant="outline"
                  size="small"
                  onPress={onSwitchToRegister}
                />
              </View>

              <View style={styles.testAccounts}>
                <Text variant="caption" color="#8E8E93" style={styles.testTitle}>
                  테스트 계정:
                </Text>
                <Text variant="caption" color="#8E8E93">
                  학생: 12345 / 123456
                </Text>
                <Text variant="caption" color="#8E8E93">
                  관리자: 99999 / admin123
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  formCard: {
    padding: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  loginButton: {
    marginTop: 8,
  },
  registerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  testAccounts: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    alignItems: 'center',
  },
  testTitle: {
    marginBottom: 4,
    fontWeight: '600',
  },
});

export default LoginForm;
