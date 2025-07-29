import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MusicRoom, Reservation, TimeSlot } from '../../../types/reservation';
import Text from '../../atoms/Text/Text';
import Card from '../../molecules/Card/Card';
import TimeSlotComponent from '../../molecules/TimeSlot/TimeSlot';

interface MusicRoomCardProps {
  musicRoom: MusicRoom;
  timeSlots: TimeSlot[];
  reservations: Reservation[];
  date: string;
  onTimeSlotPress?: (timeSlotId: string) => void;
  userRole?: string;
}

const MusicRoomCard: React.FC<MusicRoomCardProps> = ({
  musicRoom,
  timeSlots,
  reservations,
  date,
  onTimeSlotPress,
  userRole
}) => {
  const handleTimeSlotPress = (timeSlotId: string) => {
    if (onTimeSlotPress) {
      onTimeSlotPress(timeSlotId);
    }
  };

  // 시간대별 그룹화
  const morningSlots = timeSlots.filter(slot => slot.type === 'morning');
  const lunchSlots = timeSlots.filter(slot => slot.type === 'lunch');
  const afterSchoolSlots = timeSlots.filter(slot => slot.type === 'after-school');

  const renderTimeSlotGroup = (title: string, slots: TimeSlot[]) => {
    if (slots.length === 0) return null;

    return (
      <View style={styles.timeGroup}>
        <Text variant="body" weight="semibold" style={styles.groupTitle}>
          {title}
        </Text>
        {slots.map(slot => (
          <TimeSlotComponent
            key={slot.id}
            timeSlot={slot}
            reservations={reservations}
            musicRoomId={musicRoom.id}
            date={date}
            onPress={() => handleTimeSlotPress(slot.id)}
            disabled={!musicRoom.isAvailable}
          />
        ))}
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="h3" weight="semibold">
          {musicRoom.name}
        </Text>
        <View style={styles.roomInfo}>
          <Text variant="caption" color="#8E8E93">
            수용인원: {musicRoom.capacity}명
          </Text>
          {!musicRoom.isAvailable && (
            <Text variant="caption" color="#FF3B30" style={styles.unavailable}>
              사용 불가
            </Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderTimeSlotGroup('아침', morningSlots)}
        {renderTimeSlotGroup('점심', lunchSlots)}
        {renderTimeSlotGroup('방과후', afterSchoolSlots)}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    padding: 16,
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
    paddingBottom: 12,
  },
  roomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  unavailable: {
    fontWeight: '600',
  },
  scrollContainer: {
    maxHeight: 400,
  },
  timeGroup: {
    marginBottom: 16,
  },
  groupTitle: {
    marginBottom: 8,
    color: '#007AFF',
  },
});

export default MusicRoomCard;
