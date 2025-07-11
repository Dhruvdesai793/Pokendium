import React, { useState, useEffect, useRef } from 'react';
import { usePokedexStore } from '../stores/pokedexStore';
import { useToastStore } from '../stores/toastStore';
import { getTypeColor } from '../utils/helper';

const PokemonDetailModal = () => {
    const { selectedPokemon, clearSelectedPokemon } = usePokedexStore();
    const { showToast } = useToastStore();
    const modalRef = useRef(null);

    const [showShiny, setShowShiny] = useState(false);

    useEffect(() => {
        if (selectedPokemon) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '15px';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [selectedPokemon]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                clearSelectedPokemon();
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                clearSelectedPokemon();
            }
        };

        if (selectedPokemon) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [selectedPokemon, clearSelectedPokemon]);

    const playCry = () => {
        if (selectedPokemon?.cries?.latest) {
            const audio = new Audio(selectedPokemon.cries.latest);
            audio.volume = 0.5;
            audio.play().catch(error => {
                console.error("Error playing cry:", error);
                showToast({ message: "Could not play Pokémon cry.", type: "error" });
            });
        } else {
            showToast({ message: "No cry available for this Pokémon.", type: "info" });
        }
    };


    if (!selectedPokemon) {
        return null;
    }

    const {
        name, id, sprites, types, abilities, stats, height, weight,
        egg_groups, growth_rate, habitat, gender_rate,
    } = selectedPokemon;

    const flavorTextEntry = selectedPokemon.flavor_text_entries?.find(
        entry => entry.language.name === 'en'
    );
    const flavorText = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\f/g, ' ') : "No description available.";

    const baseStatTotal = stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    const getGenderRatio = (genderRate) => {
        if (genderRate === -1) return 'Genderless';
        const femaleRatio = (genderRate / 8) * 100;
        const maleRatio = 100 - femaleRatio;
        return `${maleRatio}% Male, ${femaleRatio}% Female`;
    };

    const currentSprite = showShiny ? sprites.front_shiny : sprites.front_default;
    const fallbackSprite = 'https://via.placeholder.com/150/000000/FFFFFF?text=No+Image';

    const formatStatName = (statName) => {
        switch (statName) {
            case 'hp': return 'HP';
            case 'attack': return 'Attack';
            case 'defense': return 'Defense';
            case 'special-attack': return 'Sp. Attack';
            case 'special-defense': return 'Sp. Defense';
            case 'speed': return 'Speed';
            default: return statName;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                        bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
            <div
                ref={modalRef}
                className="relative bg-gradient-to-br from-gray-900 to-zinc-950 rounded-3xl shadow-3xl border border-gray-700/50
                           w-full max-w-4xl max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in
                           flex flex-col p-6 md:p-8 space-y-6 text-white"
            >
                <button
                    onClick={() => clearSelectedPokemon()}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 text-3xl font-light z-20"
                    aria-label="Close"
                >
                    &times;
                </button>

                <div className="flex flex-col items-center justify-center md:flex-row md:justify-start md:space-x-8 pb-4 border-b border-gray-800">
                    <div className="flex-shrink-0 relative mb-4 md:mb-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`w-40 h-40 rounded-full blur-xl opacity-60 ${getTypeColor(types[0]?.type.name || 'normal')} animate-pulse-slow-medium`}></div>
                        </div>
                        <img
                            src={currentSprite || fallbackSprite}
                            alt={name}
                            className="w-56 h-56 object-contain drop-shadow-xl z-10 transition-transform duration-300 hover:scale-105"
                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackSprite; }}
                        />
                    </div>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h2 className="text-5xl font-extrabold capitalize text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 leading-tight">
                            {name}
                        </h2>
                        <p className="text-xl text-gray-400 font-semibold mt-1">ID: #{String(id).padStart(3, '0')}</p>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setShowShiny(prev => !prev)}
                                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all duration-200 shadow-md transform hover:scale-105 flex items-center"
                            >
                                <span className="mr-2">{showShiny ? 'Show Default' : 'Show Shiny'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
                                    <path d="M12 2v2" /><path d="M12 18v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M2 12h2" /><path d="M18 12h2" /><path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" /><path d="m16 12 2 2 2-2 2-2-2-2-2-2-2 2-2 2 2 2Z" />
                                </svg>
                            </button>
                            <button
                                onClick={playCry}
                                className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold transition-all duration-200 shadow-md transform hover:scale-105 flex items-center"
                            >
                                <span className="mr-2">Play Cry</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M22.39 1.61a14 14 0 0 1 0 20.78" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                    <div className="detail-section">
                        <h3 className="text-xl font-bold text-gray-200 mb-3 border-b border-gray-700 pb-1">Types</h3>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            {types.map(typeInfo => (
                                <span
                                    key={typeInfo.type.name}
                                    className={`px-5 py-2 rounded-full text-sm font-bold text-white shadow-lg ${getTypeColor(typeInfo.type.name)} bg-opacity-90 transform hover:scale-105 transition-transform duration-200`}
                                >
                                    {typeInfo.type.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3 className="text-xl font-bold text-gray-200 mb-3 border-b border-gray-700 pb-1">Abilities</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-1 pl-4">
                            {abilities.map(abilityInfo => (
                                <li key={abilityInfo.ability.name} className="text-base">
                                    <strong className="font-semibold text-gray-200">
                                        {abilityInfo.ability.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </strong>
                                    {abilityInfo.is_hidden && <span className="text-xs text-gray-500 ml-2">(Hidden Ability)</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h3 className="text-xl font-bold text-gray-200 mb-3 border-b border-gray-700 pb-1">General Info</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-300 text-base">
                            <p><strong className="font-semibold text-gray-200">Height:</strong> {height / 10} m</p>
                            <p><strong className="font-semibold text-gray-200">Weight:</strong> {weight / 10} kg</p>
                            <p><strong className="font-semibold text-gray-200">BST:</strong> {baseStatTotal}</p>
                            <p><strong className="font-semibold text-gray-200">Gender Ratio:</strong> {getGenderRatio(gender_rate)}</p>
                            <p className="col-span-2"><strong className="font-semibold text-gray-200">Egg Group(s):</strong> {egg_groups.map(g => g.name.charAt(0).toUpperCase() + g.name.slice(1)).join(', ') || 'N/A'}</p>
                            <p className="col-span-2"><strong className="font-semibold text-gray-200">Growth Rate:</strong> {growth_rate ? growth_rate.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}</p>
                            <p className="col-span-2"><strong className="font-semibold text-gray-200">Habitat:</strong> {habitat ? habitat.name.charAt(0).toUpperCase() + habitat.name.slice(1) : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3 className="text-xl font-bold text-gray-200 mb-3 border-b border-gray-700 pb-1">Base Stats</h3>
                        <div className="grid grid-cols-1 gap-y-2">
                            {stats.map(statInfo => (
                                <div key={statInfo.stat.name} className="flex items-center">
                                    <span className="w-24 text-gray-300 text-sm font-bold capitalize">
                                        {formatStatName(statInfo.stat.name)}:
                                    </span>
                                    <div className="flex-1 bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${(statInfo.base_stat / 255) * 100}%`,
                                                backgroundColor: statInfo.base_stat > 100 ? '#4CAF50' : statInfo.base_stat > 70 ? '#FFC107' : '#F44336'
                                            }}
                                        ></div>
                                    </div>
                                    <span className="ml-2 text-gray-300 text-xs font-bold">{statInfo.base_stat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="detail-section mt-6 pt-4 border-t border-gray-800">
                    <h3 className="text-xl font-bold text-gray-200 mb-3">Description</h3>
                    <p className="text-gray-300 text-base leading-relaxed">
                        {flavorText}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PokemonDetailModal;