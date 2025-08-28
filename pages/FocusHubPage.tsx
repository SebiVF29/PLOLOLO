import React from 'react';
import { useFocusTimer, TimerMode } from '../contexts/FocusTimerContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

const FocusHubPage: React.FC = () => {
    const {
        mode,
        timeLeft,
        isActive,
        pomodoros,
        timeDurations,
        toggleTimer,
        resetTimer,
        switchMode,
    } = useFocusTimer();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const progress = ((timeDurations[mode] - timeLeft) / timeDurations[mode]) * 100;

    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    const modeConfig = {
        work: { label: 'Focus', color: 'text-primary', description: "Time to get things done. Eliminate distractions and concentrate." },
        shortBreak: { label: 'Short Break', color: 'text-green-500', description: "Take a quick rest. Stretch, get some water, or look away from the screen." },
        longBreak: { label: 'Long Break', color: 'text-sky-500', description: "You've earned a longer break. Relax and recharge completely." },
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
             <h1 className="text-4xl font-bold mb-2">Focus Hub</h1>
             <p className="text-lg text-foreground/70 mb-8 max-w-md">{modeConfig[mode].description}</p>
            
            <Card className="p-8 w-full max-w-md flex flex-col items-center">
                 <div className="flex gap-4 mb-8">
                    {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map(m => (
                        <button 
                            key={m} 
                            onClick={() => switchMode(m)} 
                            className={`px-4 py-2 text-sm rounded-full font-semibold transition-all ${mode === m ? 'bg-secondary text-white shadow-lg' : 'bg-background hover:bg-foreground/10'}`}
                        >
                            {m === 'work' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                        </button>
                    ))}
                </div>

                <div className="relative w-64 h-64 my-4">
                    <svg className="w-full h-full" viewBox="0 0 240 240">
                        <circle cx="120" cy="120" r={radius} strokeWidth="15" className="stroke-foreground/10" fill="transparent" />
                        <circle
                            cx="120"
                            cy="120"
                            r={radius}
                            strokeWidth="15"
                            className={`transform -rotate-90 origin-center transition-all duration-500 ${modeConfig[mode].color}`}
                            fill="transparent"
                            stroke="currentColor"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-bold">{formatTime(timeLeft)}</span>
                        <span className={`text-lg font-semibold ${modeConfig[mode].color}`}>{modeConfig[mode].label}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-8">
                    <Button onClick={resetTimer} variant="ghost" className="p-4 rounded-full">
                        <Icon name="arrow-path" className="w-7 h-7" />
                    </Button>
                    <Button onClick={toggleTimer} variant={isActive ? 'secondary' : 'primary'} size="lg" className="rounded-full w-24 h-24 text-xl shadow-lg">
                        <Icon name={isActive ? 'pause' : 'play'} className="w-10 h-10" />
                    </Button>
                     <div className="w-16 text-center">
                        <span className="font-bold text-2xl">{pomodoros}</span>
                        <p className="text-xs text-foreground/60">sessions</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default FocusHubPage;
