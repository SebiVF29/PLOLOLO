import React, { useMemo } from 'react';
import { Task } from '../../types';
import TaskItem from './TaskItem';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onRemoveTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
}

const Quadrant: React.FC<{
    title: string;
    subtitle: string;
    tasks: Task[];
    colorClass: string;
    onToggleTask: (taskId: string) => void;
    onRemoveTask: (taskId: string) => void;
    onUpdateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
}> = ({ title, subtitle, tasks, colorClass, onToggleTask, onRemoveTask, onUpdateTask }) => (
    <div className={`flex flex-col h-full border-t-4 p-4 rounded-lg bg-card shadow-lg ${colorClass}`}>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-foreground/60 mb-3">{subtitle}</p>
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {tasks.length > 0 ? (
                <ul className="space-y-2">
                    {tasks.map(task => (
                         <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={() => onToggleTask(task.id)}
                            onRemove={() => onRemoveTask(task.id)}
                            onUpdate={(updates) => onUpdateTask(task.id, updates)}
                        />
                    ))}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-full rounded-md border-2 border-dashed border-foreground/10">
                    <p className="text-foreground/50 italic">No tasks here.</p>
                </div>
            )}
        </div>
    </div>
);


const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks, onToggleTask, onRemoveTask, onUpdateTask }) => {

    const categorizedTasks = useMemo(() => {
        const urgentImportant = tasks.filter(t => !t.completed && t.tag === 'urgent');
        const notUrgentImportant = tasks.filter(t => !t.completed && (t.tag === 'study' || t.tag === 'group'));
        const urgentNotImportant = tasks.filter(t => !t.completed && t.tag === 'delegate');
        const notUrgentNotImportant = tasks.filter(t => !t.completed && !['urgent', 'study', 'group', 'delegate'].includes(t.tag));

        return { urgentImportant, notUrgentImportant, urgentNotImportant, notUrgentNotImportant };
    }, [tasks]);

    return (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
            <div className="flex">
                <div className="w-24 shrink-0"></div> {/* Spacer */}
                <div className="flex-1 text-center font-bold text-lg p-2 text-foreground/80">Urgent</div>
                <div className="flex-1 text-center font-bold text-lg p-2 text-foreground/80">Not Urgent</div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-col justify-around w-24 text-center shrink-0">
                    <div className="font-bold text-lg text-foreground/80 transform -rotate-90 p-4 whitespace-nowrap">Important</div>
                    <div className="font-bold text-lg text-foreground/80 transform -rotate-90 p-4 whitespace-nowrap">Not Important</div>
                </div>
                <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 min-h-0 min-w-0">
                    <Quadrant
                        title="Do First"
                        subtitle="Urgent & Important"
                        tasks={categorizedTasks.urgentImportant}
                        colorClass="border-red-500"
                        onToggleTask={onToggleTask} onRemoveTask={onRemoveTask} onUpdateTask={onUpdateTask}
                    />
                     <Quadrant
                        title="Schedule"
                        subtitle="Not Urgent & Important"
                        tasks={categorizedTasks.notUrgentImportant}
                        colorClass="border-blue-500"
                        onToggleTask={onToggleTask} onRemoveTask={onRemoveTask} onUpdateTask={onUpdateTask}
                    />
                     <Quadrant
                        title="Delegate"
                        subtitle="Urgent & Not Important"
                        tasks={categorizedTasks.urgentNotImportant}
                        colorClass="border-amber-500"
                        onToggleTask={onToggleTask} onRemoveTask={onRemoveTask} onUpdateTask={onUpdateTask}
                    />
                     <Quadrant
                        title="Don't Do"
                        subtitle="Not Urgent & Not Important"
                        tasks={categorizedTasks.notUrgentNotImportant}
                        colorClass="border-gray-400"
                        onToggleTask={onToggleTask} onRemoveTask={onRemoveTask} onUpdateTask={onUpdateTask}
                    />
                </div>
            </div>
        </div>
    );
};

export default EisenhowerMatrix;
