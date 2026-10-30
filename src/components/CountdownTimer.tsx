import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  targetDateStr?: string;
  className?: string;
  variant?: 'hero' | 'compact' | 'banner';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDateStr = '2026-11-27T08:00:00+01:00',
  className = '',
  variant = 'hero',
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (timeLeft.isPast) {
    return (
      <div className={`inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm ${className}`}>
        <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
        <span>O Evento Está a Decorrer em Directo!</span>
      </div>
    );
  }

  const items = [
    { label: 'DIAS', value: timeLeft.days, color: 'text-amber-400', border: 'border-amber-500/30' },
    { label: 'HORAS', value: timeLeft.hours, color: 'text-white', border: 'border-[#B20D64]/40' },
    { label: 'MINUTOS', value: timeLeft.minutes, color: 'text-white', border: 'border-[#DC1037]/40' },
    { label: 'SEGUNDOS', value: timeLeft.seconds, color: 'text-[#FFC928]', border: 'border-purple-500/30' },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 font-mono text-xs ${className}`}>
        <Clock className="w-4 h-4 text-amber-400" />
        <span className="font-bold text-white">{timeLeft.days}d</span>
        <span className="text-zinc-500">:</span>
        <span className="font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="text-zinc-500">:</span>
        <span className="font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="text-zinc-500">:</span>
        <span className="font-bold text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header pill */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[11px] font-bold text-amber-300 uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>Contagem Regressiva Oficial · 27 de Novembro de 2026</span>
      </div>

      {/* Grid of countdown blocks */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`relative p-2.5 sm:p-3.5 rounded-2xl bg-zinc-950/80 border ${item.border} backdrop-blur-md shadow-2xl flex flex-col items-center justify-center transform transition-all hover:scale-105`}
          >
            {/* Geometric accent tab on corner */}
            <div className="absolute top-0 right-0 w-3 h-3 overflow-hidden rounded-tr-2xl">
              <div className="w-full h-full bg-gradient-to-br from-amber-400 to-[#B20D64] transform rotate-45 translate-x-1.5 -translate-y-1.5" />
            </div>

            <span className={`text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight ${item.color}`}>
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-zinc-400 mt-0.5">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
