const tagColorClasses = [
    'bg-rose-500 text-white', 'bg-blue-500 text-white', 'bg-green-500 text-white',
    'bg-amber-500 text-black', 'bg-indigo-500 text-white', 'bg-violet-500 text-white',
    'bg-pink-500 text-white', 'bg-sky-500 text-white',
];
const tagColorCache = new Map<string, string>();

export const getTagColor = (tag: string): string => {
    if (tagColorCache.has(tag)) {
        return tagColorCache.get(tag)!;
    }

    const predefined: Record<string, string> = {
        'urgent': 'bg-red-500 text-white',
        'group': 'bg-blue-500 text-white',
        'personal': 'bg-green-500 text-white',
        'study': 'bg-yellow-500 text-black',
        'delegate': 'bg-amber-500 text-white'
    };

    if (predefined[tag.toLowerCase()]) {
        return predefined[tag.toLowerCase()];
    }

    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = hash & hash;
    
    const colorClass = tagColorClasses[Math.abs(hash) % tagColorClasses.length];
    tagColorCache.set(tag, colorClass);
    return colorClass;
};
