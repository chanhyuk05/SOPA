import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Reservation, TimeSlot as TimeSlotType } from '../../../types/reservation';
import Badge from '../../atoms/Badge/Badge';
import Text from '../../atoms/Text/Text';

interface TimeSlotProps {
  timeSlot: TimeSlotType;
  reservations: Reservation[];
  musicRoomId: string;
  date: string;
  onPress?: () => void;
  disabled?: boolean;
}

const TimeSlotComponent: React.FC<TimeSlotProps> = ({
  timeSlot,
  reservations,
  musicRoomId,
  date,
  onPress,
  disabled = false
}) => {
  // 해당 시간대에 예약이 있는지 확인
  const reservation = reservations.find(r => 
    r.musicRoomId === musicRoomId && 
    r.timeSlotId === timeSlot.id && 
    r.date === date && 
    r.status === 'active'
  );

  const isReserved = !!reservation;
  const isDisabled = disabled || !timeSlot.isActive;

  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isReserved && styles.reserved,
        isDisabled && styles.disabled
      ]}
      onPress={handlePress}
      disabled={isDisabled}
    >
      <Text variant="caption" weight="medium" style={styles.timeText}>
        {timeSlot.name}
      </Text>
      <Text variant="caption" style={styles.timeRange}>
        {timeSlot.startTime} - {timeSlot.endTime}
      </Text>
      
      {isReserved && reservation && (
        <View style={styles.reservationInfo}>
          <Badge 
            text={`${reservation.studentId.substring(0, 1)}학년`}
            variant={`grade${reservation.studentId.substring(0, 1)}` as any}
            size="small"
          />
          <Text variant="caption" style={styles.studentName}>
            {reservation.studentName}
          </Text>
        </View>
      )}
      
      {!isReserved && !isDisabled && (
        <View style={styles.availableIndicator}>
          <Text variant="caption" color="#34C759">
            예약 가능
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    minHeight: 80,
  },
  reserved: {
    backgroundColor: '#F2F2F7',
    borderColor: '#C7C7CC',
  },
  disabled: {
    backgroundColor: '#F8F8F8',
    opacity: 0.6,
  },
  timeText: {
    marginBottom: 2,
  },
  timeRange: {
    color: '#8E8E93',
    marginBottom: 8,
  },
  reservationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentName: {
    color: '#8E8E93',
    flex: 1,
    textAlign: 'right',
  },
  availableIndicator: {
    alignItems: 'center',
    marginTop: 4,
  },
});

export default TimeSlotComponent;
