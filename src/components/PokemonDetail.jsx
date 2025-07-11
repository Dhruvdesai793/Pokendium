import { useState } from 'react';
import { usePokedexStore } from '../stores/pokedexStore';
import { useToastStore } from '../stores/toastStore';
import { getTypeColor } from '../utils/helper';

const PokemonDetail = () => {
    const { selectedPokemon, clearSelectedPokemon } = usePokedexStore();
    const { showToast } = useToastStore();
    const [showShinyDetail, setShowShinyDetail] = useState(false);

    if (!selectedPokemon) return null;

    const baseStatTotal = selectedPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    const getGenderRatio = (genderRate) => {
        if (genderRate === -1) return 'Genderless';
        const femaleRatio = (genderRate / 8) * 100;
        const maleRatio = 100 - femaleRatio;
        return `${maleRatio}% Male, ${femaleRatio}% Female`;
    };

    const playCry = () => {
        if (selectedPokemon.cries && selectedPokemon.cries.latest) {
            try {
                const audio = new Audio(selectedPokemon.cries.latest);
                audio.play();
            } catch (e) {
                showToast({ message: "Failed to play cry.", type: "error" });
                console.error("Error playing audio:", e);
            }
        } else {
            showToast({ message: "No cry available for this Pokémon.", type: "info" });
        }
    };

    const currentDetailSprite = showShinyDetail
        ? selectedPokemon.sprites.other['official-artwork'].front_shiny || selectedPokemon.sprites.front_shiny
        : selectedPokemon.sprites.other['official-artwork'].front_default || selectedPokemon.sprites.front_default;
    const fallbackDetailSprite = 'https://via.placeholder.com/150/000000/FFFFFF?text=No+Image';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 opacity-100 scale-100 animate-scaleIn border border-gray-700">
                <button
                    onClick={clearSelectedPokemon}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>

                <h2 className="text-4xl font-bold capitalize text-center text-white mb-4 animate-fadeInDown">{selectedPokemon.name}</h2>
                <p className="text-lg text-gray-400 text-center mb-4">ID: #{selectedPokemon.id}</p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                    <div className="relative flex flex-col items-center">
                        <img
                            src={currentDetailSprite || fallbackDetailSprite}
                            alt={selectedPokemon.name}
                            className="w-40 h-40 object-contain animate-fadeInDrop"
                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackDetailSprite; }}
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowShinyDetail(!showShinyDetail)}
                                className="flex items-center justify-center w-12 h-12 bg-yellow-400 text-gray-900 font-bold py-1 px-3 rounded-full shadow-md hover:bg-yellow-500 transition-colors text-sm transform hover:scale-110"
                                title={showShinyDetail ? "Show Default" : "Show Shiny"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="M12 2v2"/><path d="M12 18v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M18 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/><path d="m16 12 2 2 2-2 2-2-2-2-2-2-2 2-2 2 2 2Z"/></svg>
                            </button>
                            <button
                                onClick={playCry}
                                className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold py-1 px-3 rounded-full shadow-md hover:bg-blue-700 transition-colors text-sm transform hover:scale-110"
                                title="Play Cry"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M22.39 1.61a14 14 0 0 1 0 20.78"/></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 text-gray-300 w-full md:w-auto">
                        <p><strong className="font-semibold text-white">Height:</strong> {selectedPokemon.height / 10} m</p>
                        <p><strong className="font-semibold text-white">Weight:</strong> {selectedPokemon.weight / 10} kg</p>
                        <p><strong className="font-semibold text-white">Base Stat Total:</strong> {baseStatTotal}</p>

                        <div>
                            <p className="font-semibold text-white mb-1">Types:</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedPokemon.types.map(typeInfo => (
                                    <span
                                        key={typeInfo.type.name}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium text-white ${getTypeColor(typeInfo.type.name)} shadow-md transition-transform duration-200 hover:scale-105`}
                                    >
                                        {typeInfo.type.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {selectedPokemon.egg_groups && selectedPokemon.egg_groups.length > 0 && (
                            <div>
                                <p className="font-semibold text-white mb-1">Egg Groups:</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPokemon.egg_groups.map(group => (
                                        <span key={group.name} className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-200 shadow-sm capitalize">
                                            {group.name.replace(/-/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedPokemon.growth_rate && selectedPokemon.growth_rate.name && (
                            <p><strong className="font-semibold text-white">Growth Rate:</strong> {selectedPokemon.growth_rate.name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                        )}

                        {selectedPokemon.habitat && selectedPokemon.habitat.name && (
                            <p><strong className="font-semibold text-white">Habitat:</strong> {selectedPokemon.habitat.name.charAt(0).toUpperCase() + selectedPokemon.habitat.name.slice(1)}</p>
                        )}

                        {selectedPokemon.gender_rate !== undefined && (
                            <p><strong className="font-semibold text-white">Gender:</strong> {getGenderRatio(selectedPokemon.gender_rate)}</p>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2 text-center md:text-left">Abilities:</h3>
                    <ul className="list-disc list-inside text-gray-300 text-center md:text-left">
                        {selectedPokemon.abilities.map(abilityInfo => (
                            <li key={abilityInfo.ability.name} className="capitalize">{abilityInfo.ability.name} {abilityInfo.is_hidden && <span className="text-xs text-gray-500">(hidden)</span>}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-2 text-center md:text-left">Stats:</h3>
                    <div className="space-y-2">
                        {selectedPokemon.stats.map(statInfo => (
                            <div key={statInfo.stat.name} className="flex items-center">
                                <span className="w-28 capitalize font-medium text-gray-300">{statInfo.stat.name}:</span>
                                <div className="flex-1 bg-gray-700 rounded-full h-5">
                                    <div
                                        className={`h-5 rounded-full transition-all duration-500 ease-out ${getTypeColor(selectedPokemon.types[0].type.name)}`}
                                        style={{ width: `${Math.min(100, (statInfo.base_stat / 255) * 100)}%` }}
                                    ></div>
                                </div>
                                <span className="ml-2 text-white font-semibold w-8 text-right">{statInfo.base_stat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonDetail;