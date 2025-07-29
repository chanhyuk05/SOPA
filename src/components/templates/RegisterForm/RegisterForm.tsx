import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GRADES } from '../../../constants/reservation';
import { useAuth } from '../../../contexts/AuthContext';
import { userUtils } from '../../../utils/reservation';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Text from '../../atoms/Text/Text';
import Card from '../../molecules/Card/Card';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: 1,
  });
  const { register, isLoading, error } = useAuth();

  const handleRegister = async () => {
    const { studentId, name, email, password, confirmPassword, grade } = formData;

    // 유효성 검사
    if (!studentId.trim() || !name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    if (!userUtils.validateStudentId(studentId)) {
      Alert.alert('오류', '학번은 5자리 숫자여야 합니다.');
      return;
    }

    if (!userUtils.validateEmail(email)) {
      Alert.alert('오류', '올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('오류', '비밀번호는 최소 6자리 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await register({
        studentId: studentId.trim(),
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
        grade: grade as 1 | 2 | 3,
      });
    } catch (err) {
      // 에러는 AuthContext에서 처리됨
    }
  };

  const updateFormData = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('회원가입 실패', error);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="h1" weight="bold" style={styles.title}>
                회원가입
              </Text>
              <Text variant="body" color="#8E8E93" style={styles.subtitle}>
                합주실 예약을 위한 계정을 만드세요
              </Text>
            </View>

            <Card style={styles.formCard}>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text variant="body" weight="medium" style={styles.label}>
                    학번 (5자리)
                  </Text>
                  <Input
                    value={formData.studentId}
                    onChangeText={(value) => updateFormData('studentId', value)}
                    placeholder="12345"
                    keyboardType="numeric"
                    maxLength={5}
                    variant="outlined"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text variant="body" weight="medium" style={styles.label}>
                    이름
                  </Text>
                  <Input
                    value={formData.name}
                    onChangeText={(value) => updateFormData('name', value)}
                    placeholder="홍길동"
                    variant="outlined"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text variant="body" weight="medium" style={styles.label}>
                    이메일
                  </Text>
                  <Input
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    placeholder="example@sunrin.hs.kr"
                    keyboardType="email-address"
                    variant="outlined"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text variant="body" weight="medium" style={styles.label}>
                    학년
                  </Text>
                  <View style={styles.gradeSelection}>
                    {GRADES.map((grade: number) => (
                      <Button
                        key={grade}
                        title={`${grade}학년`}
                        variant={formData.grade === grade ? "primary" : "outline"}
                        size="small"
                        onPress={() => updateFormData('grade', grade)}
                        style={styles.gradeButton}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text variant="body" weight="medium" style={styles.label}>
                    비밀번호 (최소 6자리)
                  </Text>
                  <Input
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    placeholder="비밀번호를 입력하세요"
                    secureTextEntry
                    variant="outlined"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text variant="body" weight="medium" style={styles.label}>
                    비밀번호 확인
                  </Text>
                  <Input
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    secureTextEntry
                    variant="outlined"
                    autoCapitalize="none"
                  />
                </View>

                <Button
                  title={isLoading ? "회원가입 중..." : "회원가입"}
                  onPress={handleRegister}
                  disabled={isLoading}
                  style={styles.registerButton}
                />

                <View style={styles.loginSection}>
                  <Text variant="body" color="#8E8E93">
                    이미 계정이 있으신가요?{' '}
                  </Text>
                  <Button
                    title="로그인"
                    variant="outline"
                    size="small"
                    onPress={onSwitchToLogin}
                  />
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  gradeSelection: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  gradeButton: {
    flex: 1,
    minWidth: 60,
  },
  registerButton: {
    marginTop: 8,
  },
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default RegisterForm;
