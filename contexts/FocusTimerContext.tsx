import React, { createContext, useState, useEffect, useRef, useMemo, useContext, ReactNode, useCallback } from 'react';

const WORK_MINS = 25;
const SHORT_BREAK_MINS = 5;
const LONG_BREAK_MINS = 15;

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface FocusTimerContextType {
    mode: TimerMode;
    timeLeft: number;
    isActive: boolean;
    pomodoros: number;
    timeDurations: Record<TimerMode, number>;
    toggleTimer: () => void;
    resetTimer: () => void;
    switchMode: (newMode: TimerMode) => void;
}

const FocusTimerContext = createContext<FocusTimerContextType | undefined>(undefined);

export const FocusTimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<TimerMode>('work');
    const [pomodoros, setPomodoros] = useState(0);
    const [isActive, setIsActive] = useState(false);
    
    const timeDurations = useMemo(() => ({
        work: WORK_MINS * 60,
        shortBreak: SHORT_BREAK_MINS * 60,
        longBreak: LONG_BREAK_MINS * 60,
    }), []);

    const [timeLeft, setTimeLeft] = useState(timeDurations.work);

    const intervalRef = useRef<number | null>(null);

    const switchMode = useCallback((newMode: TimerMode) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(timeDurations[newMode]);
    }, [timeDurations]);

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
        if (timeLeft <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsActive(false);

            // Optionally play a sound here

            if (mode === 'work') {
                const newPomodoros = pomodoros + 1;
                setPomodoros(newPomodoros);
                const nextMode = newPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak';
                switchMode(nextMode);
            } else {
                switchMode('work');
            }
        }
    }, [timeLeft, mode, pomodoros, switchMode]);
    
    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsActive(false);
        setTimeLeft(timeDurations[mode]);
    };
    
    const value = {
        mode,
        timeLeft,
        isActive,
        pomodoros,
        timeDurations,
        toggleTimer,
        resetTimer,
        switchMode,
    };

    return (
        <FocusTimerContext.Provider value={value}>
            {children}
        </FocusTimerContext.Provider>
    );
};

export const useFocusTimer = (): FocusTimerContextType => {
    const context = useContext(FocusTimerContext);
    if (context === undefined) {
        throw new Error('useFocusTimer must be used within a FocusTimerProvider');
    }
    return context;
};
