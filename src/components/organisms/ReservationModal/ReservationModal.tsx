import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, View } from 'react-native';
import { MusicRoom, TimeSlot, User } from '../../../types/reservation';
import { userUtils } from '../../../utils/reservation';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Text from '../../atoms/Text/Text';
import Card from '../../molecules/Card/Card';

interface ReservationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (studentId: string, studentName: string) => void;
  musicRoom?: MusicRoom;
  timeSlot?: TimeSlot;
  date: string;
  user: User;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  musicRoom,
  timeSlot,
  date,
  user
}) => {
  const [studentId, setStudentId] = useState(user.studentId || '');
  const [studentName, setStudentName] = useState(user.name || '');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    // 입력값 검증
    if (!studentId.trim() || !studentName.trim()) {
      Alert.alert('오류', '학번과 이름을 모두 입력해주세요.');
      return;
    }

    if (!userUtils.validateStudentId(studentId)) {
      Alert.alert('오류', '학번은 5자리 숫자여야 합니다.');
      return;
    }

    setLoading(true);
    
    try {
      await onConfirm(studentId.trim(), studentName.trim());
      handleClose();
    } catch (error) {
      Alert.alert('오류', '예약 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStudentId(user.studentId || '');
    setStudentName(user.name || '');
    onClose();
  };

  if (!musicRoom || !timeSlot) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Card style={styles.modal}>
            <Text variant="h3" weight="semibold" style={styles.title}>
              합주실 예약
            </Text>
            
            <View style={styles.reservationInfo}>
              <View style={styles.infoRow}>
                <Text variant="body" weight="medium">합주실:</Text>
                <Text variant="body">{musicRoom.name}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text variant="body" weight="medium">시간:</Text>
                <Text variant="body">
                  {timeSlot.name} ({timeSlot.startTime} - {timeSlot.endTime})
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text variant="body" weight="medium">날짜:</Text>
                <Text variant="body">{date}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text variant="body" weight="medium" style={styles.inputLabel}>
                학번 (5자리)
              </Text>
              <Input
                value={studentId}
                onChangeText={setStudentId}
                placeholder="예: 12345"
                keyboardType="numeric"
                maxLength={5}
                variant="outlined"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="body" weight="medium" style={styles.inputLabel}>
                이름
              </Text>
              <Input
                value={studentName}
                onChangeText={setStudentName}
                placeholder="이름을 입력하세요"
                variant="outlined"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="취소"
                variant="outline"
                onPress={handleClose}
                style={styles.cancelButton}
              />
              <Button
                title={loading ? "예약 중..." : "예약하기"}
                onPress={handleConfirm}
                disabled={loading}
                style={styles.confirmButton}
              />
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modal: {
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  reservationInfo: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default ReservationModal;
