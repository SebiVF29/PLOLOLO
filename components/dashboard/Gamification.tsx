
import React, { useMemo } from 'react';
import { useAppData } from '../../contexts/AppContext';
import Card from '../ui/Card';
import { Icon, IconName } from '../ui/Icon';

interface Badge {
    name: string;
    icon: IconName;
    description: string;
    earned: boolean;
    color: string;
}

const Gamification: React.FC = () => {
    const { tasks } = useAppData();

    const { totalCompleted, streak } = useMemo(() => {
        const completedTasks = tasks.filter(t => t.completed && t.completedAt);
        const totalCompleted = completedTasks.length;

        const completedDates = new Set(
            completedTasks.map(t => new Date(t.completedAt!).toDateString())
        );

        let currentStreak = 0;
        let day = new Date();
        
        // If no tasks were completed today, start checking from yesterday
        if (!completedDates.has(day.toDateString())) {
            day.setDate(day.getDate() - 1);
        }
        
        // Count consecutive days backwards
        while (completedDates.has(day.toDateString())) {
            currentStreak++;
            day.setDate(day.getDate() - 1);
        }

        return { totalCompleted, streak: currentStreak };
    }, [tasks]);

    const allBadges: Omit<Badge, 'earned'>[] = [
        { name: 'First Step', icon: 'plus-circle', description: 'Complete 1 task', color: 'text-green-500' },
        { name: 'Task Rabbit', icon: 'check-circle', description: 'Complete 10 tasks', color: 'text-green-500' },
        { name: 'Productivity Pro', icon: 'academic-cap', description: 'Complete 50 tasks', color: 'text-green-500' },
        { name: 'Warming Up', icon: 'fire', description: '3-day streak', color: 'text-orange-500' },
        { name: 'On Fire!', icon: 'fire', description: '7-day streak', color: 'text-red-500' },
        { name: 'Unstoppable', icon: 'sparkles', description: '30-day streak', color: 'text-purple-500' },
    ];

    const badges: Badge[] = useMemo(() => {
        return allBadges.map(b => {
            let earned = false;
            if (b.description.includes('task')) {
                const required = parseInt(b.description.split(' ')[1]);
                if (totalCompleted >= required) earned = true;
            } else if (b.description.includes('streak')) {
                const required = parseInt(b.description.split('-')[0]);
                if (streak >= required) earned = true;
            }
            return { ...b, earned };
        });
    }, [totalCompleted, streak, allBadges]);

    const earnedBadges = badges.filter(b => b.earned);

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="sparkles" className="w-6 h-6 text-accent" /> Streaks & Achievements
            </h2>
            <div className="text-center mb-6 p-4 bg-background rounded-lg">
                <Icon name="fire" className={`w-12 h-12 mx-auto ${streak > 0 ? 'text-red-500' : 'text-foreground/20'}`} />
                <p className="text-3xl font-bold mt-1">{streak}</p>
                <p className="text-foreground/70 font-semibold">{streak === 1 ? 'Day Streak' : 'Day Streak'}</p>
                <p className="text-xs text-foreground/50 mt-1">{streak > 0 ? "Keep it up!" : "Complete a task to start a streak!"}</p>
            </div>
            
            <div>
                <h3 className="font-bold mb-2">Badges ({earnedBadges.length}/{allBadges.length})</h3>
                {earnedBadges.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {earnedBadges.map(badge => (
                            <div key={badge.name} title={`${badge.name}: ${badge.description}`} className="flex flex-col items-center text-center">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-background ${badge.color}`}>
                                    <Icon name={badge.icon} className="w-8 h-8 text-white bg-current p-1.5 rounded-full" />
                                </div>
                                <p className="text-xs mt-1 font-semibold">{badge.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-foreground/70 text-center py-4">Complete tasks and build streaks to earn badges!</p>
                )}
            </div>
        </Card>
    );
};

export default Gamification;
