// Clock.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Clock = () => {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            if (timerLabel === 'Session') {
              audioRef.current.play();
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              audioRef.current.play();
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, sessionLength, breakLength, timerLabel]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsRunning(false);
    setSessionLength(25);
    setBreakLength(5);
    setTimerLabel('Session');
    setTimeLeft(25 * 60);
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength((prev) => prev - 1);
      setTimeLeft((prev) => prev - 60);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength((prev) => prev + 1);
      setTimeLeft((prev) => prev + 60);
    }
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength((prev) => prev - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength((prev) => prev + 1);
    }
  };

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formattedTime = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`clock-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div id="break-label" className="label">
        Break Length
        <div className="controls">
          <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={handleBreakIncrement}>+</button>
        </div>
      </div>
      <div id="session-label" className="label">
        Session Length
        <div className="controls">
          <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={handleSessionIncrement}>+</button>
        </div>
      </div>
      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formattedTime(timeLeft)}</div>
      <button id="start_stop" onClick={handleStartStop}>Start / Stop</button>
      <button id="reset" onClick={handleReset}>Reset</button>
      <button onClick={toggleMode} className="mode-toggle">
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <audio id="beep" ref={audioRef} src={process.env.PUBLIC_URL + "/ping.mp3"} preload="auto" />
    </div>
  );
};

export default Clock;
