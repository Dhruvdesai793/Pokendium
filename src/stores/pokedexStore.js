import { create } from 'zustand';


export const usePokedexStore = create((set) => ({
    selectedPokemon: null, 
    
    setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
    
    clearSelectedPokemon: () => set({ selectedPokemon: null }),
}));