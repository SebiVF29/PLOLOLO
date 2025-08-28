import React, { useState } from 'react';
import { Task } from '../../types';
import { EmojiPicker } from './EmojiPicker';
import Input from '../ui/Input';
import Button from '../ui/Button';

const AddTaskForm: React.FC<{ onAddTask: (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => void, uniqueTags: string[] }> = ({ onAddTask, uniqueTags }) => {
    const [text, setText] = useState('');
    const [tag, setTag] = useState('study');
    const [emoji, setEmoji] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAddTask({ text, tag, emoji: emoji || undefined });
        setText('');
        setTag('study');
        setEmoji(null);
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2 p-4 bg-background rounded-lg">
            <button 
                type="button" 
                onClick={() => setShowEmojiPicker(prev => !prev)} 
                className="p-3 text-2xl rounded-lg hover:bg-foreground/10"
            >
                {emoji || '➕'}
            </button>
            {showEmojiPicker && <EmojiPicker 
                onSelect={emoji => { setEmoji(emoji); setShowEmojiPicker(false); }} 
                onClose={() => setShowEmojiPicker(false)}
            />}
            <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a new to-do..."
                className="flex-grow !p-3 bg-card"
            />
            <Input
                value={tag}
                onChange={(e) => setTag(e.target.value.toLowerCase())}
                placeholder="Tag (e.g., study)"
                className="w-32 !p-3 bg-card"
                list="tags-list"
            />
            <datalist id="tags-list">
                {uniqueTags.map(t => <option key={t} value={t} />)}
            </datalist>
            <Button type="submit" variant="primary" size="lg" className="!px-6">Add</Button>
        </form>
    );
};

export default AddTaskForm;
