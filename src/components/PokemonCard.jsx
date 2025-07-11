import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../stores/toastStore';
import { getTypeColor } from '../utils/helper';

const PokemonCard = ({ pokemon, isLoading: propIsLoading }) => {
    const navigate = useNavigate();
    const { showToast } = useToastStore();

    if (propIsLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 animate-pulse w-full h-full min-h-[250px]">
                <div className="w-28 h-28 bg-gray-700 rounded-full mb-4"></div>
                <div className="h-5 bg-gray-700 w-3/4 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 w-1/2 rounded mb-4"></div>
                <div className="flex gap-3">
                    <div className="h-6 bg-gray-700 w-16 rounded-full"></div>
                    <div className="h-6 bg-gray-700 w-16 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!pokemon) {
        return null;
    }

    const baseStatTotal = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    const currentSprite = pokemon.sprites.front_default;

    const fallbackSprite = 'https://via.placeholder.com/150/000000/FFFFFF?text=No+Image';

    const handleCardClick = () => {
        navigate(`/pokemon/${pokemon.name}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="relative group flex flex-col items-center p-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/20
                       transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-3xl cursor-pointer overflow-hidden
                       w-full h-full min-h-[250px] text-center"
        >
            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl"></div>

            <div className="w-full flex flex-col items-center z-10">
                <img
                    src={currentSprite || fallbackSprite}
                    alt={pokemon.name}
                    className="w-28 h-28 object-contain mb-3 drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackSprite; }}
                />
                <h3 className="text-2xl font-bold capitalize text-white tracking-wide mb-1
                               group-hover:text-blue-400 transition-colors duration-200">
                    {pokemon.name}
                </h3>
                <p className="text-sm text-gray-400 font-medium mb-3">ID: #{pokemon.id}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {pokemon.types.map(typeInfo => (
                        <span
                            key={typeInfo.type.name}
                            className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow ${getTypeColor(typeInfo.type.name)} bg-opacity-90`}
                        >
                            {typeInfo.type.name}
                        </span>
                    ))}
                </div>

                <p className="text-sm text-gray-300 mb-1">
                    <strong className="font-semibold">Ability:</strong>{' '}
                    {pokemon.abilities[0]?.ability.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
                </p>
                <p className="text-sm text-gray-300">
                    <strong className="font-semibold">BST:</strong> {baseStatTotal}
                </p>
            </div>
        </div>
    );
};

export default PokemonCard;