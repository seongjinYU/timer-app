import { useTimer } from './hooks/useTimer';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { GoalSetting } from './components/GoalSetting';
import './App.css';

function App() {
  const {
    status,
    elapsedSeconds,
    goalTime,
    goalReached,
    start,
    pause,
    reset,
    setGoalTime,
  } = useTimer();

  return (
    <div className="app">
      <h1 className="title">Timer</h1>
      <TimerDisplay
        elapsedSeconds={elapsedSeconds}
        status={status}
        goalTime={goalTime}
        goalReached={goalReached}
      />
      <TimerControls
        status={status}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />
      <GoalSetting
        goalTime={goalTime}
        onSetGoal={setGoalTime}
        disabled={status === 'running'}
      />
    </div>
  );
}

export default App;
