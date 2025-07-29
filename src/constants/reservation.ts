import { MusicRoom, TimeSlot, WeeklySchedule } from '../types/reservation';

// 학년 상수
export const GRADES = [1, 2, 3] as const;

// 기본 합주실 목록
export const MUSIC_ROOMS: MusicRoom[] = [
  { id: '1', name: '합주실 1', capacity: 8, isAvailable: true },
  { id: '2', name: '합주실 2', capacity: 8, isAvailable: true },
  { id: '3', name: '합주실 3', capacity: 8, isAvailable: true },
  { id: '4', name: '합주실 4', capacity: 8, isAvailable: true },
  { id: '5', name: '합주실 5', capacity: 8, isAvailable: true },
];

// 기본 시간대 설정
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  // 아침 시간
  { id: 'morning-1', name: '아침 1교시', startTime: '08:10', endTime: '09:00', type: 'morning', isActive: true },
  
  // 점심 시간
  { id: 'lunch-1', name: '점심시간', startTime: '12:20', endTime: '13:10', type: 'lunch', isActive: true },
  
  // 방과후 시간 (7교시~11교시)
  { id: 'after-7', name: '7교시', startTime: '15:20', endTime: '16:10', type: 'after-school', isActive: true },
  { id: 'after-8', name: '8교시', startTime: '16:20', endTime: '17:10', type: 'after-school', isActive: true },
  { id: 'after-9', name: '9교시', startTime: '17:20', endTime: '18:10', type: 'after-school', isActive: true },
  { id: 'after-10', name: '10교시', startTime: '18:20', endTime: '19:10', type: 'after-school', isActive: true },
  { id: 'after-11', name: '11교시', startTime: '19:20', endTime: '20:10', type: 'after-school', isActive: true },
];

// 주간 예약 창 스케줄
export const WEEKLY_SCHEDULE: WeeklySchedule = {
  monday: {
    morningWindow: {
      type: 'morning',
      openTime: '16:30', // 전날(일요일) 4:30 - 실제로는 금요일 4:30에 열림
      targetDate: 'next-day',
      gradeOrder: [2, 1, 3], // 2학년 우선
      gradeDelay: 10
    },
    afternoonWindow: {
      type: 'lunch-and-after',
      openTime: '08:10', // 당일 아침 8:10
      targetDate: 'same-day'
    }
  },
  tuesday: {
    morningWindow: {
      type: 'morning',
      openTime: '16:30', // 전날(월요일) 4:30
      targetDate: 'next-day'
    },
    afternoonWindow: {
      type: 'lunch-and-after',
      openTime: '08:10',
      targetDate: 'same-day'
    }
  },
  wednesday: {
    morningWindow: {
      type: 'morning',
      openTime: '16:30', // 전날(화요일) 4:30
      targetDate: 'next-day',
      gradeOrder: [3, 1, 2], // 3학년 우선
      gradeDelay: 10
    },
    afternoonWindow: {
      type: 'lunch-and-after',
      openTime: '08:10',
      targetDate: 'same-day'
    }
  },
  thursday: {
    morningWindow: {
      type: 'morning',
      openTime: '16:30', // 전날(수요일) 4:30
      targetDate: 'next-day'
    },
    afternoonWindow: {
      type: 'lunch-and-after',
      openTime: '08:10',
      targetDate: 'same-day'
    }
  },
  friday: {
    morningWindow: {
      type: 'morning',
      openTime: '16:30', // 전날(목요일) 4:30
      targetDate: 'next-day',
      gradeOrder: [1, 2, 3], // 1학년 우선
      gradeDelay: 10
    },
    afternoonWindow: {
      type: 'lunch-and-after',
      openTime: '08:10',
      targetDate: 'same-day'
    }
  }
};

// 시스템 설정
export const SYSTEM_CONFIG = {
  // 예약 제한
  MAX_AFTER_SCHOOL_RESERVATIONS_PER_DAY: 1, // 방과후 시간은 하루 1회만
  
  // 자동 삭제 스케줄
  WEEKLY_CLEANUP: {
    day: 'friday', // 금요일
    time: '12:00', // 오후 12시
    excludeAfterSchool: true // 금요일 방과후는 제외
  },
  
  FRIDAY_AFTER_SCHOOL_CLEANUP: {
    day: 'saturday', // 토요일
    time: '00:00' // 자정
  },
  
  // 학년별 색상
  GRADE_COLORS: {
    1: '#FF6B6B', // 1학년 - 빨강
    2: '#4ECDC4', // 2학년 - 청록
    3: '#45B7D1'  // 3학년 - 파랑
  }
};
