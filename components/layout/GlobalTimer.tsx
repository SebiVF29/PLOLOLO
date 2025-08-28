import React from 'react';
import { useFocusTimer } from '../../contexts/FocusTimerContext';
import { Icon } from '../ui/Icon';
import { useNavigate } from 'react-router-dom';

const GlobalTimer: React.FC = () => {
    const { timeLeft, mode } = useFocusTimer();
    const navigate = useNavigate();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const modeConfig = {
        work: { label: 'Focus Time', color: 'border-red-500', icon: 'fire' as const },
        shortBreak: { label: 'Break Time', color: 'border-green-500', icon: 'clock' as const },
        longBreak: { label: 'Break Time', color: 'border-sky-500', icon: 'clock' as const },
    };

    return (
        <div
            className={`fixed top-6 right-6 z-50 p-3 rounded-lg shadow-2xl flex items-center gap-3 cursor-pointer transition-all animate-fade-in-down bg-card border-l-4 ${modeConfig[mode].color}`}
            onClick={() => navigate('/focus-hub')}
            role="alert"
            aria-live="assertive"
        >
            <Icon name={modeConfig[mode].icon} className="w-6 h-6 text-current" />
            <div>
                <p className="text-sm font-semibold">{modeConfig[mode].label}</p>
                <p className="text-2xl font-bold text-card-foreground">{formatTime(timeLeft)}</p>
            </div>
        </div>
    );
};

export default GlobalTimer;
