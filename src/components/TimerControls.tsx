interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerControls({ status, onStart, onPause, onReset }: TimerControlsProps) {
  return (
    <div className="timer-controls">
      <button
        className="btn btn-start"
        onClick={onStart}
        disabled={status === 'running'}
      >
        {status === 'paused' ? 'Resume' : 'Start'}
      </button>
      <button
        className="btn btn-pause"
        onClick={onPause}
        disabled={status !== 'running'}
      >
        Pause
      </button>
      <button
        className="btn btn-reset"
        onClick={onReset}
        disabled={status === 'idle'}
      >
        Reset
      </button>
    </div>
  );
}
