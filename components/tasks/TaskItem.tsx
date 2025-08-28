import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Icon } from '../ui/Icon';
import { EmojiPicker } from './EmojiPicker';
import { getTagColor } from '../../utils/taskUtils';

const TaskItem: React.FC<{ task: Task; onToggle: () => void; onRemove: () => void; onUpdate: (updates: Partial<Omit<Task, 'id'>>) => void; }> = ({ task, onToggle, onRemove, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if(editText.trim()) {
            onUpdate({ text: editText });
        }
        setIsEditing(false);
    };
    
    useEffect(() => {
        if(isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    return (
        <li className="flex items-center gap-4 p-3 bg-background rounded-lg group">
            <div className="relative">
                <button 
                    onClick={() => setShowEmojiPicker(p => !p)} 
                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg hover:bg-foreground/10 transition-colors ${task.completed ? 'opacity-50' : ''}`}
                >
                    {task.emoji || '⚪'}
                </button>
                {showEmojiPicker && <EmojiPicker 
                    onSelect={emoji => { onUpdate({ emoji }); setShowEmojiPicker(false); }} 
                    onClose={() => setShowEmojiPicker(false)}
                />}
            </div>
            <div className="flex-1">
                {isEditing ? (
                    <Input
                        ref={inputRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="!p-1"
                    />
                ) : (
                    <p className={`transition-colors ${task.completed ? 'line-through text-foreground/50' : ''}`}>
                        {task.text}
                    </p>
                )}
            </div>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getTagColor(task.tag)}`}>
                {task.tag}
            </span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isEditing && <Button variant="ghost" size="sm" className="!p-2" onClick={() => setIsEditing(true)}><Icon name="pencil" className="w-4 h-4" /></Button>}
                <Button variant="ghost" size="sm" className="!p-2 text-accent" onClick={onRemove}><Icon name="trash" className="w-4 h-4" /></Button>
            </div>
             <button
                onClick={onToggle}
                className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
                    task.completed ? 'bg-primary border-primary' : 'border-foreground/40 hover:border-primary'
                }`}
            >
                {task.completed && <Icon name="check-circle" className="w-5 h-5 text-white" style={{ stroke: 'none', fill: 'currentColor' }} />}
            </button>
        </li>
    );
};

export default TaskItem;
