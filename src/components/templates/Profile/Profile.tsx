import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AuthContext';
import { userUtils } from '../../../utils/reservation';
import Badge from '../../atoms/Badge/Badge';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Text from '../../atoms/Text/Text';
import Card from '../../molecules/Card/Card';

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const { user, updateProfile, logout, isLoading, error } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  if (!user) {
    return null;
  }

  // 학번에서 학년 추출 (첫 번째 자리)
  const getGradeFromStudentId = (studentId: string): number => {
    const firstDigit = parseInt(studentId.charAt(0));
    return firstDigit >= 1 && firstDigit <= 3 ? firstDigit : 1;
  };

  const userGrade = getGradeFromStudentId(user.studentId);

  // 수정사항이 있는지 확인
  const hasChanges = () => {
    return formData.name !== user.name || formData.email !== (user.email || '');
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }

    if (formData.email && !userUtils.validateEmail(formData.email)) {
      Alert.alert('오류', '올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      await updateProfile({
        name: formData.name.trim(),
        email: formData.email?.trim() || undefined,
        grade: userGrade as 1 | 2 | 3,
      });
      setIsEditing(false);
      Alert.alert('성공', '프로필이 업데이트되었습니다.');
    } catch (err) {
      // 에러는 AuthContext에서 처리됨
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말로 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            logout();
            onLogout();
          },
        },
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super-admin': return '총관리자';
      case 'sub-admin': return '부관리자';
      default: return '학생';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super-admin': return 'error' as const;
      case 'sub-admin': return 'warning' as const;
      default: return 'info' as const;
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('오류', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 그라데이션 영역 */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView>
            <View style={styles.headerContent}>
              {/* 프로필 아바타 */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={40} color="#fff" />
                </View>
              </View>
              
              {/* 사용자 정보 */}
              <View style={styles.userInfo}>
                <Text variant="h2" weight="bold" style={styles.userName}>
                  {user.name}
                </Text>
                <Text variant="body" style={styles.userDetail}>
                  {user.studentId} • {userGrade}학년
                </Text>
                <View style={styles.roleBadgeContainer}>
                  <Badge 
                    text={getRoleDisplayName(user.role)}
                    variant={getRoleBadgeVariant(user.role)}
                  />
                </View>
              </View>
              
              {/* 편집 버튼 */}
              <TouchableOpacity 
                style={styles.editIconButton}
                onPress={() => {
                  if (isEditing) {
                    if (hasChanges()) {
                      handleSave();
                    } else {
                      handleCancel();
                    }
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                <Ionicons 
                  name={
                    isEditing 
                      ? (hasChanges() ? "checkmark" : "close") 
                      : "pencil"
                  } 
                  size={20} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          {/* 개인 정보 카드 */}
          <Card style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-outline" size={20} color="#667eea" />
              <Text variant="body" weight="bold" style={styles.cardTitle}>
                개인 정보
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>학번</Text>
              <Text style={styles.infoValue}>{user.studentId}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이름</Text>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  placeholder="이름을 입력하세요"
                  variant="outlined"
                  style={styles.editInput}
                />
              ) : (
                <Text style={styles.infoValue}>{user.name}</Text>
              )}
            </View>
            
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>학년</Text>
              <Text style={styles.infoValue}>{userGrade}학년</Text>
            </View>
          </Card>

          {/* 연락처 정보 카드 */}
          <Card style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="mail-outline" size={20} color="#667eea" />
              <Text variant="body" weight="bold" style={styles.cardTitle}>
                연락처 정보
              </Text>
            </View>
            
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>이메일</Text>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  placeholder="이메일을 입력하세요 (선택사항)"
                  keyboardType="email-address"
                  variant="outlined"
                  autoCapitalize="none"
                  style={styles.editInput}
                />
              ) : (
                <Text style={[styles.infoValue, !user.email && styles.emptyValue]}>
                  {user.email || '설정되지 않음'}
                </Text>
              )}
            </View>
          </Card>

          {/* 액션 카드 */}
          <Card style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="settings-outline" size={20} color="#667eea" />
              <Text variant="body" weight="bold" style={styles.cardTitle}>
                계정 관리
              </Text>
            </View>
            
            <View style={styles.actionContainer}>
              <Button
                title="로그아웃"
                variant="outline"
                onPress={handleLogout}
                style={[styles.logoutButton, { borderColor: '#FF3B30' }]}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    marginBottom: -20,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userDetail: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    fontSize: 14,
  },
  roleBadgeContainer: {
    alignItems: 'center',
  },
  editIconButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  infoCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  emptyValue: {
    color: '#999',
    fontStyle: 'italic',
  },
  editInput: {
    flex: 1,
    marginLeft: 12,
  },
  actionContainer: {
    gap: 12,
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 16,
  },
});

export default Profile;
