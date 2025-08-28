
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Icon } from '../ui/Icon';

const WORK_MINS = 25;
const SHORT_BREAK_MINS = 5;
const LONG_BREAK_MINS = 15;

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const PomodoroTimer: React.FC = () => {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(WORK_MINS * 60);
    const [isActive, setIsActive] = useState(false);
    const [pomodoros, setPomodoros] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const timeDurations = useMemo(() => ({
        work: WORK_MINS * 60,
        shortBreak: SHORT_BREAK_MINS * 60,
        longBreak: LONG_BREAK_MINS * 60,
    }), []);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    useEffect(() => {
        if (timeLeft === 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsActive(false);

            if (mode === 'work') {
                const newPomodoros = pomodoros + 1;
                setPomodoros(newPomodoros);
                const nextMode = newPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak';
                setMode(nextMode);
                setTimeLeft(timeDurations[nextMode]);
            } else {
                setMode('work');
                setTimeLeft(timeDurations.work);
            }
            // Optionally play a sound here
        }
    }, [timeLeft, mode, pomodoros, timeDurations]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsActive(false);
        setTimeLeft(timeDurations[mode]);
    };

    const switchMode = (newMode: TimerMode) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(timeDurations[newMode]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const progress = ((timeDurations[mode] - timeLeft) / timeDurations[mode]) * 100;

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    const modeConfig = {
        work: { label: 'Focus', color: 'text-primary' },
        shortBreak: { label: 'Short Break', color: 'text-green-500' },
        longBreak: { label: 'Long Break', color: 'text-sky-500' },
    };

    return (
        <Card className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Icon name="clock" className="w-6 h-6 text-secondary" /> Focus Hub
            </h2>
            <div className="flex gap-2 mb-4">
                {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map(m => (
                    <button key={m} onClick={() => switchMode(m)} className={`px-2 py-1 text-xs rounded-full font-semibold ${mode === m ? 'bg-secondary text-white' : 'bg-background hover:bg-foreground/10'}`}>
                        {m === 'work' ? 'Work' : m === 'shortBreak' ? 'Short' : 'Long'}
                    </button>
                ))}
            </div>
            <div className="relative w-40 h-40 my-4">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={radius} strokeWidth="10" className="stroke-foreground/10" fill="transparent" />
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        strokeWidth="10"
                        className={`transform -rotate-90 origin-center transition-all duration-500 ${modeConfig[mode].color}`}
                        fill="transparent"
                        stroke="currentColor"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
                    <span className={`text-sm font-semibold ${modeConfig[mode].color}`}>{modeConfig[mode].label}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button onClick={resetTimer} variant="ghost" className="p-3">
                    <Icon name="arrow-path" className="w-6 h-6" />
                </Button>
                <Button onClick={toggleTimer} variant={isActive ? 'secondary' : 'primary'} size="lg" className="rounded-full w-20 h-20 text-xl">
                    <Icon name={isActive ? 'pause' : 'play'} className="w-8 h-8" />
                </Button>
                <div className="w-12 text-center">
                    <span className="font-bold text-lg">{pomodoros}</span>
                    <p className="text-xs text-foreground/60">sessions</p>
                </div>
            </div>
        </Card>
    );
};

export default PomodoroTimer;
