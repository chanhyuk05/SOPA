import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AuthContext';
import { useReservation } from '../../../hooks/useReservation';
import type { AuthUser } from '../../../types/auth';
import {
    Reservation,
    TimeSlot,
    MusicRoom
} from '../../../types/reservation';
import {
    dateUtils,
    reservationUtils,
    userUtils
} from '../../../utils/reservation';
import Badge from '../../atoms/Badge/Badge';
import Button from '../../atoms/Button/Button';
import Text from '../../atoms/Text/Text';
import MusicRoomCard from '../../organisms/MusicRoomCard/MusicRoomCard';
import ReservationModal from '../../organisms/ReservationModal/ReservationModal';

interface ReservationTemplateProps {
  onReservationCreate?: (reservation: Reservation) => void;
  onReservationCancel?: (reservationId: string) => void;
}

const ReservationTemplate: React.FC<ReservationTemplateProps> = ({
  onReservationCreate,
  onReservationCancel
}) => {
  const { user } = useAuth();
  const {
    reservations,
    musicRooms,
    timeSlots,
    loading,
    error,
    getReservationsByDate,
    getMusicRooms,
    getTimeSlots,
    createReservation,
    cancelReservation,
    clearError
  } = useReservation();

  const [selectedDate, setSelectedDate] = useState(dateUtils.getCurrentDate());
  
  // 모달 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMusicRoom, setSelectedMusicRoom] = useState<any>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | undefined>();

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  // 날짜 변경시 예약 목록 새로고침
  useEffect(() => {
    if (selectedDate) {
      getReservationsByDate(selectedDate);
    }
  }, [selectedDate, getReservationsByDate]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        getMusicRooms(),
        getTimeSlots(),
        getReservationsByDate(selectedDate)
      ]);
    } catch (err) {
      console.error('초기 데이터 로드 실패:', err);
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  // 시간대 선택 핸들러
  const handleTimeSlotPress = (musicRoomId: string, timeSlotId: string) => {
    const musicRoom = musicRooms.find(room => room.id === musicRoomId);
    const timeSlot = timeSlots.find(slot => slot.id === timeSlotId);
    
    if (!musicRoom || !timeSlot) return;

    // 이미 예약된 시간대인지 확인
    const existingReservation = reservations.find(r => 
      r.musicRoomId === musicRoomId && 
      r.timeSlotId === timeSlotId && 
      r.date === selectedDate && 
      r.status === 'active'
    );

    if (existingReservation) {
      // 예약 취소 옵션 표시 (본인 예약이거나 관리자인 경우)
      if (existingReservation.userId === user.id || userUtils.isAdmin(user)) {
        Alert.alert(
          '예약 취소',
          `${existingReservation.studentName}의 예약을 취소하시겠습니까?`,
          [
            { text: '아니오', style: 'cancel' },
            { 
              text: '예', 
              style: 'destructive',
              onPress: () => onReservationCancel?.(existingReservation.id)
            }
          ]
        );
      } else {
        Alert.alert('알림', '이미 예약된 시간대입니다.');
      }
      return;
    }

    // 예약 가능 여부 확인
    if (timeSlot.type === 'after-school') {
      if (!reservationUtils.canMakeAfterSchoolReservation(reservations, user.id, selectedDate)) {
        Alert.alert('제한', `방과후 시간은 하루에 ${SYSTEM_CONFIG.MAX_AFTER_SCHOOL_RESERVATIONS_PER_DAY}시간만 예약 가능합니다.`);
        return;
      }
    }

    // 예약 창 열림 시간 확인 (관리자가 아닌 경우)
    if (!userUtils.isAdmin(user)) {
      const windowType = timeSlot.type === 'morning' ? 'morning' : 'lunch-and-after';
      if (!reservationUtils.isReservationWindowOpen(selectedDate, windowType, user.grade)) {
        Alert.alert('알림', '아직 예약 시간이 아닙니다.');
        return;
      }
    }

    setSelectedMusicRoom(musicRoom);
    setSelectedTimeSlot(timeSlot);
    setModalVisible(true);
  };

  // 예약 생성 핸들러
  const handleReservationCreate = async (studentId: string, studentName: string) => {
    if (!selectedMusicRoom || !selectedTimeSlot) return;

    const newReservation = {
      userId: user.id,
      musicRoomId: selectedMusicRoom.id,
      timeSlotId: selectedTimeSlot.id,
      date: selectedDate,
      studentId,
      studentName,
      status: 'active' as const
    };

    await onReservationCreate?.(newReservation);
    
    // 로컬 상태 업데이트 (실제로는 서버에서 받아와야 함)
    setReservations(prev => [...prev, {
      ...newReservation,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString()
    }]);
  };

  // 현재 시간 정보
  const currentTime = dateUtils.getCurrentTime();
  const isToday = selectedDate === dateUtils.getCurrentDate();

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text variant="h2" weight="bold">
          합주실 예약
        </Text>
        
        {userUtils.isAdmin(user) && (
          <Badge 
            text={user.role === 'super-admin' ? '총관리자' : '부관리자'} 
            variant="info"
          />
        )}
      </View>

      {/* 날짜 선택 */}
      <View style={styles.dateSelector}>
        <Button
          title="◀"
          size="small"
          variant="outline"
          onPress={() => handleDateChange('prev')}
        />
        
        <View style={styles.dateInfo}>
          <Text variant="h3" weight="semibold">
            {selectedDate}
          </Text>
          {isToday && (
            <Text variant="caption" color="#007AFF">
              현재 시간: {currentTime}
            </Text>
          )}
        </View>
        
        <Button
          title="▶"
          size="small"
          variant="outline"
          onPress={() => handleDateChange('next')}
        />
      </View>

      {/* 합주실 목록 */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {musicRooms.map(room => (
          <MusicRoomCard
            key={room.id}
            musicRoom={room}
            timeSlots={timeSlots}
            reservations={reservations}
            date={selectedDate}
            onTimeSlotPress={(timeSlotId) => handleTimeSlotPress(room.id, timeSlotId)}
            userRole={user.role}
          />
        ))}
      </ScrollView>

      {/* 예약 모달 */}
      <ReservationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleReservationCreate}
        musicRoom={selectedMusicRoom}
        timeSlot={selectedTimeSlot}
        date={selectedDate}
        user={user}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  dateInfo: {
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default ReservationTemplate;
