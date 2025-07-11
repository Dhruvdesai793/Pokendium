


export const getTypeColor = (type) => {
    switch (type) {
        case 'normal': return 'bg-gray-400';
        case 'fire': return 'bg-red-500';
        case 'water': return 'bg-blue-500';
        case 'grass': return 'bg-green-500';
        case 'electric': return 'bg-yellow-500';
        case 'ice': return 'bg-blue-200';
        case 'fighting': return 'bg-red-700';
        case 'poison': return 'bg-purple-500';
        case 'ground': return 'bg-yellow-700';
        case 'flying': return 'bg-indigo-400';
        case 'psychic': return 'bg-pink-500';
        case 'bug': return 'bg-green-700';
        case 'rock': return 'bg-gray-700';
        case 'ghost': return 'bg-purple-700';
        case 'dragon': return 'bg-indigo-700';
        case 'steel': return 'bg-gray-500';
        case 'fairy': return 'bg-pink-300';
        default: return 'bg-gray-300';
    }
};