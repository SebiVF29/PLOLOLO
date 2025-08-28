import React, { useState, useMemo } from 'react';
import { useAppData } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getTagColor } from '../utils/taskUtils';
import AddTaskForm from '../components/tasks/AddTaskForm';
import TaskItem from '../components/tasks/TaskItem';
import EisenhowerMatrix from '../components/tasks/EisenhowerMatrix';

const TasksPage: React.FC = () => {
    const { tasks, addTask, updateTask, toggleTask, removeTask } = useAppData();
    const [view, setView] = useState<'list' | 'matrix'>('list');
    const [filterTag, setFilterTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const uniqueTags = useMemo(() => {
        const tags = new Set(tasks.map(t => t.tag));
        // Add delegate tag if not present, so it can be suggested
        if (!tags.has('delegate')) {
            tags.add('delegate');
        }
        return Array.from(tags);
    }, [tasks]);

    const searchedTasks = useMemo(() => {
        return tasks.filter(task => {
            return !searchQuery || task.text.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [tasks, searchQuery]);

    const listFilteredTasks = useMemo(() => {
        if (view !== 'list') return [];
        return searchedTasks.filter(task => {
            return !filterTag || task.tag === filterTag;
        });
    }, [searchedTasks, filterTag, view]);


    const incompleteTasks = listFilteredTasks.filter(t => !t.completed);
    const completedTasks = listFilteredTasks.filter(t => t.completed);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold">To-Do List</h1>
                 <div className="flex items-center gap-2 p-1 bg-background rounded-full">
                     <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('list')}>List View</Button>
                     <Button variant={view === 'matrix' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('matrix')}>Matrix View</Button>
                 </div>
            </div>
            
            <Card className="mb-6">
                <AddTaskForm onAddTask={addTask} uniqueTags={uniqueTags} />
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Input 
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-xs"
                    />
                    {view === 'list' && (
                        <div className="flex items-center gap-2 flex-grow">
                            <span className="text-sm font-semibold">Filter by tag:</span>
                            <Button
                                variant={!filterTag ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setFilterTag(null)}
                            >
                                All
                            </Button>
                            {uniqueTags.map(tag => (
                                <Button
                                    key={tag}
                                    size="sm"
                                    onClick={() => setFilterTag(tag)}
                                    className={filterTag === tag ? getTagColor(tag) : 'bg-background text-card-foreground hover:bg-foreground/10'}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {view === 'list' ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h2 className="text-2xl font-bold mb-4">To-Do ({incompleteTasks.length})</h2>
                        {incompleteTasks.length > 0 ? (
                            <ul className="space-y-3">
                                {incompleteTasks.map(task => (
                                    <TaskItem 
                                        key={task.id} 
                                        task={task} 
                                        onToggle={() => toggleTask(task.id)} 
                                        onRemove={() => removeTask(task.id)}
                                        onUpdate={(updates) => updateTask(task.id, updates)}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-foreground/70 text-center py-8">All done! Time for a break. 🎉</p>
                        )}
                    </Card>
                    <Card>
                        <h2 className="text-2xl font-bold mb-4">Completed ({completedTasks.length})</h2>
                        {completedTasks.length > 0 ? (
                            <ul className="space-y-3">
                                {completedTasks.map(task => (
                                    <TaskItem 
                                        key={task.id} 
                                        task={task} 
                                        onToggle={() => toggleTask(task.id)} 
                                        onRemove={() => removeTask(task.id)}
                                        onUpdate={(updates) => updateTask(task.id, updates)}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-foreground/70 text-center py-8">No tasks completed yet. Let's get to it!</p>
                        )}
                    </Card>
                </div>
            ) : (
                <EisenhowerMatrix 
                    tasks={searchedTasks}
                    onToggleTask={toggleTask}
                    onRemoveTask={removeTask}
                    onUpdateTask={updateTask}
                />
            )}
        </div>
    );
};

export default TasksPage;
