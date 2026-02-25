import { useState } from 'react';

interface GoalSettingProps {
  goalTime: number | null;
  onSetGoal: (seconds: number | null) => void;
  disabled: boolean;
}

export function GoalSetting({ goalTime, onSetGoal, disabled }: GoalSettingProps) {
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleSet = () => {
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const total = m * 60 + s;
    if (total > 0) {
      onSetGoal(total);
    }
  };

  const handleClear = () => {
    onSetGoal(null);
    setMinutes('');
    setSeconds('');
  };

  return (
    <div className="goal-setting">
      <h3>Goal Time</h3>
      <div className="goal-inputs">
        <input
          type="number"
          min="0"
          placeholder="Min"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          disabled={disabled}
        />
        <span>:</span>
        <input
          type="number"
          min="0"
          max="59"
          placeholder="Sec"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          disabled={disabled}
        />
        <button className="btn btn-goal" onClick={handleSet} disabled={disabled}>
          Set
        </button>
        {goalTime !== null && (
          <button className="btn btn-clear" onClick={handleClear} disabled={disabled}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
