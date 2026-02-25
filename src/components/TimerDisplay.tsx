interface TimerDisplayProps {
  elapsedSeconds: number;
  status: 'idle' | 'running' | 'paused';
  goalTime: number | null;
  goalReached: boolean;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function TimerDisplay({ elapsedSeconds, status, goalTime, goalReached }: TimerDisplayProps) {
  const statusLabels = {
    idle: 'Idle',
    running: 'Running',
    paused: 'Paused',
  };

  return (
    <div className="timer-display">
      <div className={`time ${goalReached ? 'goal-reached' : ''}`}>
        {formatTime(elapsedSeconds)}
      </div>
      <span className={`status-badge status-${status}`}>
        {statusLabels[status]}
      </span>
      {goalTime !== null && (
        <div className="goal-info">
          Goal: {formatTime(goalTime)}
          {goalReached && <span className="goal-alert"> — Goal Reached!</span>}
        </div>
      )}
    </div>
  );
}
