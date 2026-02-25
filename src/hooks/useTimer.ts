import { useState, useRef, useCallback, useEffect } from 'react';

type TimerStatus = 'idle' | 'running' | 'paused';

interface UseTimerReturn {
  status: TimerStatus;
  elapsedSeconds: number;
  goalTime: number | null;
  goalReached: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setGoalTime: (seconds: number | null) => void;
}

export function useTimer(): UseTimerReturn {
  // 현재 타이머 상태 (멈춤 / 실행중 / 일시정지)
  const [status, setStatus] = useState<TimerStatus>('idle');

  // 화면에 표시되는 경과 시간 (초 단위)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // 사용자가 설정한 목표 시간 (초 단위, 없으면 null)
  const [goalTime, setGoalTime] = useState<number | null>(null);

  // 목표 시간에 도달했는지 여부
  const [goalReached, setGoalReached] = useState(false);

  // 가장 최근에 start/resume 버튼을 누른 시각 (ms)
  // → pause 시 "얼마나 흘렀는지" 계산에 사용
  const startTimeRef = useRef<number>(0);

  // pause를 눌렀을 때까지 쌓인 누적 시간 (ms)
  // → resume 후에도 이전 시간이 이어지게 함
  const accumulatedRef = useRef<number>(0);

  // setInterval의 ID를 저장해두는 공간
  // → clearInterval로 인터벌을 멈출 때 필요
  const intervalRef = useRef<number | null>(null);

  // 실행 중인 인터벌을 멈추는 함수
  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 현재 경과 시간을 계산해서 화면에 반영하는 함수
  // 공식: 누적시간 + (지금 - 마지막 시작시각)
  const updateElapsed = useCallback(() => {
    const now = Date.now();
    const totalMs = accumulatedRef.current + (now - startTimeRef.current);
    setElapsedSeconds(Math.floor(totalMs / 1000));
  }, []);

  // Start / Resume 버튼을 눌렀을 때 실행
  // → 시작 시각을 기록하고, 100ms마다 화면 시간을 갱신
  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setStatus('running');
    setGoalReached(false);

    clearTimer();
    intervalRef.current = window.setInterval(updateElapsed, 100);
  }, [clearTimer, updateElapsed]);

  // Pause 버튼을 눌렀을 때 실행
  // → 지금까지 흐른 시간을 누적에 저장하고 인터벌 중단
  const pause = useCallback(() => {
    accumulatedRef.current += Date.now() - startTimeRef.current;
    setStatus('paused');
    clearTimer();
    setElapsedSeconds(Math.floor(accumulatedRef.current / 1000));
  }, [clearTimer]);

  // Reset 버튼을 눌렀을 때 실행
  // → 모든 시간 데이터와 상태를 초기값으로 되돌림
  const reset = useCallback(() => {
    accumulatedRef.current = 0;
    startTimeRef.current = 0;
    setStatus('idle');
    setElapsedSeconds(0);
    setGoalReached(false);
    clearTimer();
  }, [clearTimer]);

  // 경과 시간이 바뀔 때마다 목표 도달 여부를 확인
  useEffect(() => {
    if (goalTime !== null && elapsedSeconds >= goalTime && status === 'running') {
      setGoalReached(true);
    }
  }, [elapsedSeconds, goalTime, status]);

  // 컴포넌트가 사라질 때 인터벌이 남아있으면 정리
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    status,
    elapsedSeconds,
    goalTime,
    goalReached,
    start,
    pause,
    reset,
    setGoalTime,
  };
}
