import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToastStore } from '../stores/toastStore';
import { getTypeColor } from '../utils/helper';

const PokemonDetailPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToastStore();

    const [showShiny, setShowShiny] = useState(false);

    const { data: pokemon, isLoading, isError, error } = useQuery({
        queryKey: ['pokemonDetails', name],
        queryFn: async () => {
            if (!name) throw new Error("Pokémon name is missing.");

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Pokemon "${name}" not found.`);
                }
                throw new Error(`Failed to fetch details for ${name}: ${response.statusText}`);
            }
            const data = await response.json();

            let speciesData = null;
            try {
                const speciesResponse = await fetch(data.species.url);
                if (speciesResponse.ok) {
                    speciesData = await speciesResponse.json();
                } else {
                    console.warn(`Failed to fetch species data for ${name}: ${speciesResponse.statusText}`);
                }
            } catch (speciesError) {
                console.error(`Error fetching species data for ${name}:`, speciesError);
            }

            return {
                ...data,
                egg_groups: speciesData?.egg_groups || [],
                growth_rate: speciesData?.growth_rate || null,
                habitat: speciesData?.habitat || null,
                gender_rate: speciesData?.gender_rate !== undefined ? speciesData.gender_rate : -1,
                flavor_text_entries: speciesData?.flavor_text_entries || [],
                cries: data.cries || null,
            };
        },
        enabled: !!name,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
        onError: (err) => {
            showToast({ message: err.message, type: 'error' });
            navigate('/search');
        }
    });

    const playCry = () => {
        if (pokemon?.cries?.latest) {
            const audio = new Audio(pokemon.cries.latest);
            audio.volume = 0.5;
            audio.play().catch(error => {
                console.error("Error playing cry:", error);
                showToast({ message: "Could not play Pokémon cry.", type: "error" });
            });
        } else {
            showToast({ message: "No cry available for this Pokémon.", type: "info" });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-inter">
                <div className="animate-pulse flex flex-col items-center bg-gradient-to-br from-gray-800 to-zinc-900 rounded-3xl p-8 shadow-2xl border border-gray-700 w-full max-w-4xl">
                    <div className="w-64 h-64 bg-gray-700 rounded-full mb-6"></div>
                    <div className="h-10 bg-gray-700 w-3/4 rounded mb-4"></div>
                    <div className="h-6 bg-gray-700 w-1/2 rounded mb-8"></div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="h-24 bg-gray-700 rounded"></div>
                        <div className="h-24 bg-gray-700 rounded"></div>
                        <div className="h-24 bg-gray-700 rounded"></div>
                        <div className="h-24 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !pokemon) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-red-400 text-2xl p-4 font-inter">
                <p className="mb-4 text-center">Error loading Pokémon details or Pokémon not found. Please try again.</p>
                <button onClick={() => navigate('/search')} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105">
                    Go Back to Search
                </button>
            </div>
        );
    }

    const {
        id, sprites, types, abilities, stats, height, weight,
        egg_groups, growth_rate, habitat, gender_rate, flavor_text_entries,
    } = pokemon;

    const flavorTextEntry = flavor_text_entries?.find(
        entry => entry.language.name === 'en'
    );

    const flavorText = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\f/g, ' ').replace(/(\r\n|\n|\r)/gm, " ") : "No description available.";

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
        <div className="min-h-screen flex items-center justify-center font-normal bg-gray-900 text-white p-4 font-inter">
            <div
                className="relative bg-gradient-to-br from-gray-900 to-zinc-950 rounded-3xl shadow-3xl border border-gray-700/50
                           w-full max-w-4xl max-h-[95vh] overflow-y-auto transform scale-95 animate-scale-in
                           flex flex-col p-6 md:p-8 space-y-6"
            >
                <button
                    onClick={() => navigate('/search')}
                    className="absolute top-4 left-4 text-gray-300 hover:text-white transition-colors duration-200 text-lg font-bold z-20 flex items-center"
                    aria-label="Go Back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
                    </svg>
                    Back to Search
                </button>

                <div className="flex flex-col items-center justify-center md:flex-row md:justify-start md:space-x-8 pb-4 border-b border-gray-800 pt-8 md:pt-0">
                    <div className="flex-shrink-0 relative mb-4 md:mb-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`w-40 h-40 rounded-full blur-xl opacity-60 ${getTypeColor(types[0]?.type.name || 'normal')} animate-pulse-slow-medium`}></div>
                        </div>
                        <img
                            src={currentSprite || fallbackSprite}
                            alt={pokemon.name}
                            className="w-56 h-56 object-contain drop-shadow-xl z-10 transition-transform duration-300 hover:scale-105"
                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackSprite; }}
                        />
                    </div>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h2 className="text-5xl font-extrabold capitalize text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 leading-tight">
                            {pokemon.name}
                        </h2>
                        <p className="text-2xl text-gray-300 font-extrabold mt-1">ID: #{String(id).padStart(3, '0')}</p>

                        <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                            {sprites.front_shiny && (
                                <button
                                    onClick={() => setShowShiny(prev => !prev)}
                                    className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all duration-200 shadow-md transform hover:scale-105 flex items-center text-base"
                                >
                                    <span className="mr-2">{showShiny ? 'Show Default' : 'Show Shiny'}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2v2"/><path d="M12 18v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M18 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/><path d="m16 12 2 2 2-2 2-2-2-2-2-2-2 2-2 2 2 2Z"/>
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={playCry}
                                className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold transition-all duration-200 shadow-md transform hover:scale-105 flex items-center text-base"
                            >
                                <span className="mr-2">Play Cry</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M22.39 1.61a14 14 0 0 1 0 20.78"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                    <div className="detail-section">
                        <h3 className="text-2xl font-extrabold text-gray-100 mb-3 border-b border-gray-700 pb-2">Types</h3>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            {types.map(typeInfo => (
                                <span
                                    key={typeInfo.type.name}
                                    className={`px-5 py-2 rounded-full text-lg font-extrabold text-white shadow-lg ${getTypeColor(typeInfo.type.name)} bg-opacity-90 transform hover:scale-105 transition-transform duration-200 capitalize`}
                                >
                                    {typeInfo.type.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3 className="text-2xl font-extrabold text-gray-100 mb-3 border-b border-gray-700 pb-2">Abilities</h3>
                        <ul className="list-disc list-inside text-gray-200 space-y-1 pl-4 text-base">
                            {abilities.map(abilityInfo => (
                                <li key={abilityInfo.ability.name} className="text-lg">
                                    <strong className="font-bold text-gray-100">
                                        {abilityInfo.ability.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </strong>
                                    {abilityInfo.is_hidden && <span className="text-sm text-gray-500 ml-2">(Hidden Ability)</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h3 className="text-2xl font-extrabold text-gray-100 mb-3 border-b border-gray-700 pb-2">General Info</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-200 text-lg">
                            <p><strong className="font-bold text-gray-100">Height:</strong> {height / 10} m</p>
                            <p><strong className="font-bold text-gray-100">Weight:</strong> {weight / 10} kg</p>
                            <p><strong className="font-bold text-gray-100">BST:</strong> {baseStatTotal}</p>
                            <p><strong className="font-bold text-gray-100">Gender Ratio:</strong> {getGenderRatio(gender_rate)}</p>
                            <p className="col-span-2"><strong className="font-bold text-gray-100">Egg Group(s):</strong> {egg_groups.map(g => g.name.charAt(0).toUpperCase() + g.name.slice(1)).join(', ') || 'N/A'}</p>
                            <p className="col-span-2"><strong className="font-bold text-gray-100">Growth Rate:</strong> {growth_rate ? growth_rate.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}</p>
                            <p className="col-span-2"><strong className="font-bold text-gray-100">Habitat:</strong> {habitat ? habitat.name.charAt(0).toUpperCase() + habitat.name.slice(1) : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3 className="text-2xl font-extrabold text-gray-100 mb-3 border-b border-gray-700 pb-2">Base Stats</h3>
                        <div className="grid grid-cols-1 gap-y-3">
                            {stats.map(statInfo => (
                                <div key={statInfo.stat.name} className="flex items-center">
                                    <span className="w-28 text-gray-200 text-base font-bold capitalize">
                                        {formatStatName(statInfo.stat.name)}:
                                    </span>
                                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                                        <div
                                            className="h-3 rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${(statInfo.base_stat / 255) * 100}%`,
                                                backgroundColor: statInfo.base_stat > 100 ? '#4CAF50' : statInfo.base_stat > 70 ? '#FFC107' : '#F44336'
                                            }}
                                        ></div>
                                    </div>
                                    <span className="ml-3 text-gray-200 text-sm font-extrabold">{statInfo.base_stat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="detail-section mt-6 pt-4 border-t font-normal border-gray-800">
                    <h3 className="text-2xl font-extrabold text-gray-100 mb-3">Description</h3>
                    <p className="text-gray-100 text-lg leading-relaxed">
                        {flavorText}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PokemonDetailPage;