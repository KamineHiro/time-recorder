'use client';

import { useState, useEffect } from 'react';

type TimerProps = {
  onSave: (duration: number, subject: string) => void;
};

const Timer = ({ onSave }: TimerProps) => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleSave = () => {
    if (time > 0 && subject.trim() !== '') {
      onSave(time, subject);
      handleReset();
      setSubject('');
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    // 一時間（3600秒）を満タンとして、現在の進捗を計算
    // 1時間以上の場合は、時間数で割って常に表示
    const oneHour = 3600;
    const hours = Math.floor(time / oneHour);
    const remainingSeconds = time % oneHour;
    const progress = (remainingSeconds / oneHour) * 100;
    
    return hours > 0 ? progress : progress;
  };

  return (
    <div className="w-full max-w-md p-6 rounded-2xl overflow-hidden relative glass-effect neon-shadow border border-indigo-100 dark:border-indigo-900/30">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 gradient-text">
          勉強時間タイマー
        </h2>
        
        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            勉強科目
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 dark:text-white transition-all duration-200"
            placeholder="科目名を入力"
          />
        </div>
        
        <div className="mb-8 relative">
          <div className="text-5xl font-mono font-bold text-center py-4 mb-4 text-gray-800 dark:text-white transition-all duration-300 ease-in-out">
            {formatTime(time)}
          </div>
          
          <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          
          {isRunning && (
            <div className="absolute top-0 right-0 w-3 h-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>開始</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>一時停止</span>
              </button>
            )}
          </div>
          
          <div className="col-span-1">
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-medium shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>リセット</span>
            </button>
          </div>
          
          <div className="col-span-2 mt-3">
            <button
              onClick={handleSave}
              disabled={time === 0 || subject.trim() === ''}
              className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${
                time === 0 || subject.trim() === ''
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              <span>保存</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer; 