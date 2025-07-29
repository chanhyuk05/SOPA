// 합주실 예약 시스템 관련 타입들

export interface User {
  id: string;
  studentId: string; // 5자리 학번
  name: string;
  grade: 1 | 2 | 3; // 학년
  role: 'student' | 'sub-admin' | 'super-admin'; // 일반학생, 부관리자(강사), 총관리자(과대/학과장)
}

export interface MusicRoom {
  id: string;
  name: string;
  capacity: number;
  isAvailable: boolean;
}

export interface TimeSlot {
  id: string;
  name: string;
  startTime: string; // "HH:mm" 형식
  endTime: string;
  type: 'morning' | 'lunch' | 'after-school';
  isActive: boolean; // 관리자가 활성화/비활성화 가능
}

export interface Reservation {
  id: string;
  userId: string;
  musicRoomId: string;
  timeSlotId: string;
  date: string; // "YYYY-MM-DD" 형식
  studentId: string; // 예약자 학번
  studentName: string; // 예약자 이름
  createdAt: string;
  status: 'active' | 'cancelled';
}

export interface ReservationWindow {
  type: 'morning' | 'lunch-and-after';
  openTime: string; // "HH:mm" 형식
  targetDate: string; // 예약 가능한 날짜
  gradeOrder?: number[]; // 학년별 우선순위 (예: [2, 1, 3] = 2학년 먼저, 그 다음 1학년, 3학년)
  gradeDelay?: number; // 우선순위 외 학년의 지연시간 (분)
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface WeeklySchedule {
  [key: string]: {
    morningWindow: ReservationWindow;
    afternoonWindow: ReservationWindow;
  };
}
