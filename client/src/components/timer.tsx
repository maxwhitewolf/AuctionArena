import { useState, useEffect } from "react";

interface TimerProps {
  deadline: Date;
}

export function Timer({ deadline }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadline.getTime() - now;
      setTimeLeft(Math.max(0, Math.floor(distance / 1000)));
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg px-4 py-2">
      <div className="flex items-center space-x-2">
        <i className="fas fa-clock text-red-600"></i>
        <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-red-600'}`}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
