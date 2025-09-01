import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

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
    <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
      timeLeft <= 10 
        ? 'bg-red-500/20 border-red-500/40 shadow-red-500/20' 
        : timeLeft <= 30
        ? 'bg-yellow-500/20 border-yellow-500/40 shadow-yellow-500/20'
        : 'bg-green-500/20 border-green-500/40 shadow-green-500/20'
    }`}>
      <Clock className={`w-5 h-5 ${
        timeLeft <= 10 ? 'text-red-400' : timeLeft <= 30 ? 'text-yellow-400' : 'text-green-400'
      }`} />
      <span className={`text-2xl font-bold font-mono tracking-wider ${
        timeLeft <= 10 
          ? 'text-red-400 animate-pulse' 
          : timeLeft <= 30
          ? 'text-yellow-400'
          : 'text-green-400'
      }`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
      <span className={`text-xs font-medium ${
        timeLeft <= 10 ? 'text-red-400' : timeLeft <= 30 ? 'text-yellow-400' : 'text-green-400'
      }`}>
        remaining
      </span>
    </div>
  );
}