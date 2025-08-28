import React, { useRef, useEffect } from 'react';

export const EMOJI_CATEGORIES = {
    "Academic": ['📚', '✍️', '🔬', '💻', '🧠', '🎓', '📖', '📝', '🏫', '📈', '🧐', '💡'],
    "Planning & Status": ['📌', '📅', '⏰', '✅', '❌', '⏳', '➡️', '🔴', '🟡', '🟢', '❕', '❓'],
    "Life & Activities": ['🎉', '🏋️', '☕', '🎨', '🎵', '✈️', '🍔', '🏠', '💤', '💬', '🤝', '🥳'],
    "Objects": ['📎', '📁', '📞', '📧', '💰', '🔑', '📦', '📍', '🗑️', '🔔', '📣', '⚙️'],
};

export const EmojiPicker: React.FC<{ onSelect: (emoji: string) => void, onClose: () => void }> = ({ onSelect, onClose }) => {
    const pickerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [pickerRef, onClose]);

    return (
        <div ref={pickerRef} className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 animate-fade-in-up">
            <div className="relative bg-card rounded-lg shadow-xl border border-foreground/10 overflow-hidden">
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-b border-r border-foreground/10 transform rotate-45"></div>
                <div className="h-64 overflow-y-auto p-2">
                    {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                        <div key={category}>
                            <h3 className="text-sm font-bold text-foreground/60 p-2 sticky top-0 bg-card/80 backdrop-blur-sm">{category}</h3>
                            <div className="grid grid-cols-7 gap-1">
                                {emojis.map(emoji => (
                                    <button key={emoji} onClick={() => onSelect(emoji)} className="text-2xl p-1 rounded-md hover:bg-foreground/10 transition-colors aspect-square flex items-center justify-center">
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
