import { SYSTEM_CONFIG, WEEKLY_SCHEDULE } from '../constants/reservation';
import { Reservation, User, WeekDay } from '../types/reservation';

/**
 * 날짜 관련 유틸리티 함수들
 */
export const dateUtils = {
  // 현재 날짜를 YYYY-MM-DD 형식으로 반환
  getCurrentDate: (): string => {
    return new Date().toISOString().split('T')[0];
  },

  // 날짜를 요일로 변환
  getWeekDay: (date: string): WeekDay => {
    const weekDays: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayIndex = new Date(date).getDay();
    // 일요일(0) -> 월요일(0), 월요일(1) -> 화요일(1), ... 금요일(5) -> 금요일(4)
    return weekDays[dayIndex === 0 ? 0 : dayIndex - 1] || 'monday';
  },

  // 다음 날짜 계산
  getNextDate: (date: string): string => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  },

  // 현재 시간을 HH:mm 형식으로 반환
  getCurrentTime: (): string => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  },

  // 시간 비교 (time1이 time2보다 늦으면 true)
  isTimeAfter: (time1: string, time2: string): boolean => {
    return time1 > time2;
  }
};

/**
 * 예약 가능 여부 확인
 */
export const reservationUtils = {
  // 현재 예약 창이 열려있는지 확인
  isReservationWindowOpen: (targetDate: string, windowType: 'morning' | 'lunch-and-after', userGrade?: number): boolean => {
    const currentTime = dateUtils.getCurrentTime();
    const currentDate = dateUtils.getCurrentDate();
    const weekDay = dateUtils.getWeekDay(targetDate);
    const schedule = WEEKLY_SCHEDULE[weekDay];

    if (windowType === 'morning') {
      const window = schedule.morningWindow;
      let openTime = window.openTime;

      // 학년별 지연시간 적용
      if (window.gradeOrder && userGrade && window.gradeDelay) {
        const gradeIndex = window.gradeOrder.indexOf(userGrade);
        if (gradeIndex > 0) {
          const [hours, minutes] = openTime.split(':').map(Number);
          const delayedMinutes = minutes + (gradeIndex * window.gradeDelay);
          const delayedHours = hours + Math.floor(delayedMinutes / 60);
          openTime = `${delayedHours.toString().padStart(2, '0')}:${(delayedMinutes % 60).toString().padStart(2, '0')}`;
        }
      }

      return dateUtils.isTimeAfter(currentTime, openTime) || dateUtils.isTimeAfter(currentTime, '00:00');
    } else {
      const window = schedule.afternoonWindow;
      return currentDate === targetDate && dateUtils.isTimeAfter(currentTime, window.openTime);
    }
  },

  // 방과후 시간 예약 개수 확인
  getAfterSchoolReservationCount: (reservations: Reservation[], userId: string, date: string): number => {
    return reservations.filter(r => 
      r.userId === userId && 
      r.date === date && 
      r.status === 'active'
    ).length;
  },

  // 방과후 예약 가능 여부 확인
  canMakeAfterSchoolReservation: (reservations: Reservation[], userId: string, date: string): boolean => {
    const count = reservationUtils.getAfterSchoolReservationCount(reservations, userId, date);
    return count < SYSTEM_CONFIG.MAX_AFTER_SCHOOL_RESERVATIONS_PER_DAY;
  },

  // 특정 시간대와 합주실이 이미 예약되어 있는지 확인
  isSlotReserved: (reservations: Reservation[], musicRoomId: string, timeSlotId: string, date: string): boolean => {
    return reservations.some(r => 
      r.musicRoomId === musicRoomId && 
      r.timeSlotId === timeSlotId && 
      r.date === date && 
      r.status === 'active'
    );
  }
};

/**
 * 사용자 권한 관련
 */
export const userUtils = {
  // 관리자 권한 확인
  isAdmin: (user: User): boolean => {
    return user.role === 'super-admin' || user.role === 'sub-admin';
  },

  // 총관리자 권한 확인
  isSuperAdmin: (user: User): boolean => {
    return user.role === 'super-admin';
  },

  // 학번에서 학년 추출
  getGradeFromStudentId: (studentId: string): number => {
    // 학번의 첫 번째 자리가 학년이라고 가정
    const firstDigit = parseInt(studentId.charAt(0));
    return firstDigit >= 1 && firstDigit <= 3 ? firstDigit : 1;
  },

  // 학번 유효성 검사
  validateStudentId: (studentId: string): boolean => {
    return /^\d{5}$/.test(studentId);
  },

  // 이메일 유효성 검사
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

/**
 * 예약 데이터 정리 관련
 */
export const cleanupUtils = {
  // 주간 정리 (금요일 오후 12시)
  shouldPerformWeeklyCleanup: (): boolean => {
    const now = new Date();
    const currentDay = now.getDay(); // 0: 일요일, 5: 금요일
    const currentTime = dateUtils.getCurrentTime();
    
    return currentDay === 5 && dateUtils.isTimeAfter(currentTime, SYSTEM_CONFIG.WEEKLY_CLEANUP.time);
  },

  // 금요일 방과후 정리 (토요일 자정)
  shouldPerformFridayAfterSchoolCleanup: (): boolean => {
    const now = new Date();
    const currentDay = now.getDay(); // 6: 토요일
    
    return currentDay === 6;
  },

  // 정리할 예약 목록 반환
  getReservationsToCleanup: (reservations: Reservation[], type: 'weekly' | 'friday-after-school'): Reservation[] => {
    const currentDate = dateUtils.getCurrentDate();
    const friday = new Date();
    friday.setDate(friday.getDate() - (friday.getDay() === 6 ? 1 : 6 - friday.getDay()));
    const fridayDate = friday.toISOString().split('T')[0];

    if (type === 'weekly') {
      // 금요일 방과후를 제외한 이번 주 모든 예약
      return reservations.filter(r => {
        const reservationDate = new Date(r.date);
        const startOfWeek = new Date(friday);
        startOfWeek.setDate(startOfWeek.getDate() - 4); // 월요일
        
        return reservationDate >= startOfWeek && 
               reservationDate <= friday && 
               !(r.date === fridayDate && r.timeSlotId.startsWith('after-'));
      });
    } else {
      // 금요일 방과후 예약만
      return reservations.filter(r => 
        r.date === fridayDate && r.timeSlotId.startsWith('after-')
      );
    }
  }
};
