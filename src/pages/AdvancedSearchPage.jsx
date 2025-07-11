import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useToastStore } from '../stores/toastStore';
import { usePokedexStore } from '../stores/pokedexStore';
import PokemonCard from '../components/PokemonCard';

const AdvancedSearchPage = () => {
  const { showToast } = useToastStore();

  const [filters, setFilters] = useState({
    type: '',
    generation: '',
    ability: '',
    minHeight: '',
    maxHeight: '',
    minWeight: '',
    maxWeight: '',
    minBST: '',
    maxBST: '',
    eggGroup: '',
    gender: '',
    growthRate: '',
    habitat: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { type, generation, ability, minHeight, maxHeight, minWeight, maxWeight, minBST, maxBST, eggGroup, gender, growthRate, habitat } = filters;

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const isAnyFilterSelected = useMemo(() => {
    return type !== '' || generation !== '' || ability !== '' || minHeight !== '' || maxHeight !== '' || minWeight !== '' || maxWeight !== '' || minBST !== '' || maxBST !== '' || eggGroup !== '' || gender !== '' || growthRate !== '' || habitat !== '';
  }, [type, generation, ability, minHeight, maxHeight, minWeight, maxWeight, minBST, maxBST, eggGroup, gender, growthRate, habitat]);

  const fetchOptions = (endpoint, limit = '') => async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/${endpoint}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    }
    return res.json();
  };

  const { data: allPokemonNames, isLoading: isLoadingAllPokemonNames, isError: isErrorAllPokemonNames, error: errorAllPokemonNames } = useQuery({
    queryKey: ['allPokemonNames'],
    queryFn: fetchOptions('pokemon?limit=10000'),
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: true,
  });

  const { data: allEggGroups, isLoading: isLoadingEggGroups, isError: isErrorEggGroups, error: errorAllEggGroups } = useQuery({
    queryKey: ['allEggGroups'],
    queryFn: fetchOptions('egg-group/'),
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: true,
  });

  const { data: allGenders, isLoading: isLoadingGenders, isError: isErrorGenders, error: errorAllGenders } = useQuery({
    queryKey: ['allGenders'],
    queryFn: fetchOptions('gender/'),
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: true,
  });

  const { data: allGrowthRates, isLoading: isLoadingGrowthRates, isError: isErrorGrowthRates, error: errorAllGrowthRates } = useQuery({
    queryKey: ['allGrowthRates'],
    queryFn: fetchOptions('growth-rate/'),
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: true,
  });

  const { data: allHabitats, isLoading: isLoadingHabitats, isError: isErrorHabitats, error: errorAllHabitats } = useQuery({
    queryKey: ['allHabitats'],
    queryFn: fetchOptions('pokemon-habitat/'),
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: true,
  });

  const { data: allTypes, isLoading: isLoadingTypes, isError: isErrorTypes, error: errorAllTypes } = useQuery({
    queryKey: ['allTypes'],
    queryFn: fetchOptions('type/'),
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: true,
  });

  const { data: allGenerations, isLoading: isLoadingGenerations, isError: isErrorGenerations, error: errorAllGenerations } = useQuery({
    queryKey: ['allGenerations'],
    queryFn: fetchOptions('generation/'),
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: true,
  });

  const { data: allAbilities, isLoading: isLoadingAbilities, isError: isErrorAbilities, error: errorAllAbilities } = useQuery({
    queryKey: ['allAbilities'],
    queryFn: fetchOptions('ability/?limit=350'),
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: true,
  });

  const { data: pokemonByTypeData, isLoading: isLoadingPokemonByType, isError: isErrorPokemonByType, error: errorPokemonByType } = useQuery({
    queryKey: ['pokemonByType', type],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (!res.ok) throw new Error(`Failed to fetch pokemon for type ${type}: ${res.statusText}`);
      const data = await res.json();
      return data.pokemon.map(p => p.pokemon.name);
    },
    enabled: !!type,
    staleTime: 10 * 60 * 1000,
  });

  const { data: pokemonByGenerationData, isLoading: isLoadingPokemonByGeneration, isError: isErrorPokemonByGeneration, error: errorPokemonByGeneration } = useQuery({
    queryKey: ['pokemonByGeneration', generation],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
      if (!res.ok) throw new Error(`Failed to fetch pokemon for generation ${generation}: ${res.statusText}`);
      const data = await res.json();
      return data.pokemon_species.map(p => p.name);
    },
    enabled: !!generation,
    staleTime: 10 * 60 * 1000,
  });

  const { data: pokemonByAbilityData, isLoading: isLoadingPokemonByAbility, isError: isErrorPokemonByAbility, error: errorPokemonByAbility } = useQuery({
    queryKey: ['pokemonByAbility', ability],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`);
      if (!res.ok) throw new Error(`Failed to fetch pokemon for ability ${ability}: ${res.statusText}`);
      const data = await res.json();
      return data.pokemon.map(p => p.pokemon.name);
    },
    enabled: !!ability,
    staleTime: 10 * 60 * 1000,
  });

  const { data: pokemonByEggGroupData, isLoading: isLoadingPokemonByEggGroup, isError: isErrorPokemonByEggGroup, error: errorPokemonByEggGroup } = useQuery({
    queryKey: ['pokemonByEggGroup', eggGroup],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/egg-group/${eggGroup}`);
      if (!res.ok) throw new Error(`Failed to fetch pokemon for egg group ${eggGroup}: ${res.statusText}`);
      const data = await res.json();
      return data.pokemon_species.map(s => s.name);
    },
    enabled: !!eggGroup,
    staleTime: 10 * 60 * 1000,
  });

  const { data: pokemonByGenderData, isLoading: isLoadingPokemonByGender, isError: isErrorPokemonByGender, error: errorPokemonByGender } = useQuery({
    queryKey: ['pokemonByGender', gender],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/gender/${gender}`);
      if (!res.ok) throw new Error(`Failed to fetch pokemon for gender ${gender}: ${res.statusText}`);
      const data = await res.json();
      return data.pokemon_species_details.map(d => d.pokemon_species.name);
    },
    enabled: !!gender,
    staleTime: 10 * 60 * 1000,
  });

  const { data: pokemonByGrowthRateData, isLoading: isLoadingPokemonByGrowthRate, isError: isErrorPokemonByGrowthRate, error: errorPokemonByGrowthRate } = useQuery({
    queryKey: ['pokemonByGrowthRate', growthRate],
    queryFn: async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/growth-rate/${growthRate}`);
      if (!res.ok) throw new Error(`Failed to fetch pokemon for growth rate ${growthRate} : ${res.statusText}`);
      const data = await res.json();
      return data.pokemon_species.map(s => s.name);
    },
    enabled: !!growthRate,
    staleTime: 10 * 60 * 1000,
  });

  const { data: pokemonByHabitatData, isLoading: isLoadingPokemonByHabitat, isError: isErrorPokemonByHabitat, error: errorPokemonByHabitat } = useQuery({
    queryKey: ['pokemonByHabitat', habitat],
    queryFn : async () => {
      const res =await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${habitat}`);
      if (!res.ok) throw new Error(`Failed to fetch pokemon for habitat ${habitat} : ${res.statusText}`);
      const data = await res.json();
      return data.pokemon_species.map(s => s.name);
    },
    enabled: !!habitat,
  });

const isLoadingFilterOptions = isLoadingAllPokemonNames || isLoadingTypes || isLoadingGenerations || isLoadingAbilities || isLoadingPokemonByType || isLoadingPokemonByGeneration || isLoadingPokemonByAbility || isLoadingEggGroups || isLoadingGenders || isLoadingGrowthRates || isLoadingHabitats || isLoadingPokemonByEggGroup || isLoadingPokemonByGender || isLoadingPokemonByGrowthRate || isLoadingPokemonByHabitat;

  const preliminaryFilteredNames = useMemo(() => {
    if (isLoadingAllPokemonNames || isErrorAllPokemonNames || !allPokemonNames) return [];

    let currentNames = new Set(allPokemonNames.results.map(p => p.name));
    
    if (type && pokemonByTypeData) {
      currentNames = new Set([...currentNames].filter(name => pokemonByTypeData.includes(name)));
    }
    if (generation && pokemonByGenerationData) {
      currentNames = new Set([...currentNames].filter(name => pokemonByGenerationData.includes(name)));
    }
    if (ability && pokemonByAbilityData) {
      currentNames = new Set([...currentNames].filter(name => pokemonByAbilityData.includes(name)));
    }
    if (eggGroup && pokemonByEggGroupData) {
      currentNames = new Set([...currentNames].filter(name => pokemonByEggGroupData.includes(name)));
    }
    if (gender && pokemonByGenderData) {
      currentNames = new Set([...currentNames].filter(name => pokemonByGenderData.includes(name)));
    }
    if (growthRate && pokemonByGrowthRateData) {
      currentNames = new Set([...currentNames].filter(name => pokemonByGrowthRateData.includes(name)));
    }
    if (habitat && pokemonByHabitatData) {
      currentNames = new Set([...currentNames].filter(name => pokemonByHabitatData.includes(name)));
    }

    return Array.from(currentNames);
  }, [
    allPokemonNames, isLoadingAllPokemonNames, isErrorAllPokemonNames,
    type, pokemonByTypeData,
    generation, pokemonByGenerationData,
    ability, pokemonByAbilityData,
    eggGroup, pokemonByEggGroupData,
    gender, pokemonByGenderData,
    growthRate, pokemonByGrowthRateData,
    habitat, pokemonByHabitatData,
  ]);

  const paginatedNamesForDetailsFetch = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return preliminaryFilteredNames.slice(startIndex, endIndex);
  }, [preliminaryFilteredNames, currentPage, itemsPerPage]);

  const pokemonDetailsQueries = useQueries({
    queries: paginatedNamesForDetailsFetch.map(name => ({
      queryKey: ['pokemonDetails', name],
      queryFn: async () => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error(`Failed to fetch details for ${name}: ${response.statusText}`);
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
      enabled: paginatedNamesForDetailsFetch.length > 0,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    })),
  });

  const isLoadingCurrentPageDetails = pokemonDetailsQueries.some(query => query.isLoading);
  const isErrorCurrentPageDetails = pokemonDetailsQueries.some(query => query.isError);

  const finalDisplayedPokemon = useMemo(() => {
    let currentPokemonObjects = pokemonDetailsQueries
      .filter(query => query.isSuccess && query.data)
      .map(query => query.data);

    if (minHeight !== '') {
      const minH = parseFloat(minHeight);
      if (!isNaN(minH)) {
        currentPokemonObjects = currentPokemonObjects.filter(p => (p.height / 10) >= minH);
      }
    }
    if (maxHeight !== '') {
      const maxH = parseFloat(maxHeight);
      if (!isNaN(maxH)) {
        currentPokemonObjects = currentPokemonObjects.filter(p => (p.height / 10) <= maxH);
      }
    }

    if (minWeight !== '') {
      const minW = parseFloat(minWeight);
      if (!isNaN(minW)) {
        currentPokemonObjects = currentPokemonObjects.filter(p => (p.weight / 10) >= minW);
      }
    }
    if (maxWeight !== '') {
      const maxW = parseFloat(maxWeight);
      if (!isNaN(maxW)) {
        currentPokemonObjects = currentPokemonObjects.filter(p => (p.weight / 10) <= maxW);
      }
    }

    if (minBST !== '' || maxBST !== '') {
      currentPokemonObjects = currentPokemonObjects.filter(p => {
        const bst = p.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        const minB = minBST !== '' && !isNaN(parseInt(minBST, 10)) ? parseInt(minBST, 10) : -Infinity;
        const maxB = maxBST !== '' && !isNaN(parseInt(maxBST, 10)) ? parseInt(maxBST, 10) : Infinity;
        return bst >= minB && bst <= maxB;
      });
    }
    
    return currentPokemonObjects;
  }, [
    pokemonDetailsQueries,
    minHeight, maxHeight, minWeight, maxWeight, minBST, maxBST
  ]);

  const totalPages = Math.ceil(preliminaryFilteredNames.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      generation: '',
      ability: '',
      minHeight: '',
      maxHeight: '',
      minWeight: '',
      maxWeight: '',
      minBST: '',
      maxBST: '',
      eggGroup: '',
      gender: '',
      growthRate: '',
      habitat: '',
    });
    setCurrentPage(1);
    showToast("Filters cleared.", "info");
  };

  const isAnyCategoricalFilterActive = useMemo(() => {
    return type !== '' || generation !== '' || ability !== '' || eggGroup !== '' || gender !== '' || growthRate !== '' || habitat !== '';
  }, [type, generation, ability, eggGroup, gender, growthRate, habitat]);

  const showNoResultsMessage = useMemo(() => {
    if (isLoadingFilterOptions) return false;
    if (preliminaryFilteredNames.length === 0 && isAnyCategoricalFilterActive) return true;
    if (preliminaryFilteredNames.length > 0 && finalDisplayedPokemon.length === 0 && !isLoadingCurrentPageDetails && isAnyFilterSelected) return true;
    return false;
  }, [isLoadingFilterOptions, preliminaryFilteredNames, isAnyCategoricalFilterActive, finalDisplayedPokemon, isLoadingCurrentPageDetails, isAnyFilterSelected]);

  useEffect(() => {
    if (isErrorAllPokemonNames) showToast(`Error fetching all Pokemon names: ${errorAllPokemonNames?.message}`, 'error');
    if (isErrorTypes) showToast(`Error fetching types: ${errorAllTypes?.message}`, 'error');
    if (isErrorGenerations) showToast(`Error fetching generations: ${errorAllGenerations?.message}`, 'error');
    if (isErrorAbilities) showToast(`Error fetching abilities: ${errorAllAbilities?.message}`, 'error');
    if (isErrorPokemonByType) showToast(`Error fetching Pokemon by type: ${errorPokemonByType?.message}`, 'error');
    if (isErrorPokemonByGeneration) showToast(`Error fetching Pokemon by generation: ${errorPokemonByGeneration?.message}`, 'error');
    if (isErrorPokemonByAbility) showToast(`Error fetching Pokemon by ability: ${errorPokemonByAbility?.message}`, 'error');
    if (isErrorEggGroups) showToast(`Error fetching egg groups: ${errorAllEggGroups?.message}`, 'error');
    if (isErrorGenders) showToast(`Error fetching genders: ${errorAllGenders?.message}`, 'error');
    if (isErrorGrowthRates) showToast(`Error fetching growth rates: ${errorAllGrowthRates?.message}`, 'error');
    if (isErrorHabitats) showToast(`Error fetching habitats: ${errorAllHabitats?.message}`, 'error');
    if (isErrorPokemonByEggGroup) showToast(`Error fetching Pokemon by egg group: ${errorPokemonByEggGroup?.message}`, 'error');
    if (isErrorPokemonByGender) showToast(`Error fetching Pokemon by gender: ${errorPokemonByGender?.message}`, 'error');
    if (isErrorPokemonByGrowthRate) showToast(`Error fetching Pokemon by growth rate: ${errorPokemonByGrowthRate?.message}`, 'error');
    if (isErrorPokemonByHabitat) showToast(`Error fetching Pokemon by habitat: ${errorPokemonByHabitat?.message}`, 'error');
    if (isErrorCurrentPageDetails) showToast(`Error fetching current page Pokemon details.`, 'error');
  }, [
    isErrorAllPokemonNames, errorAllPokemonNames, isErrorTypes, errorAllTypes, isErrorGenerations, errorAllGenerations, isErrorAbilities, errorAllAbilities,
    isErrorPokemonByType, errorPokemonByType, isErrorPokemonByGeneration, errorPokemonByGeneration, isErrorPokemonByAbility, errorPokemonByAbility,
    isErrorEggGroups, errorAllEggGroups, isErrorGenders, errorAllGenders, isErrorGrowthRates, errorAllGrowthRates, isErrorHabitats, errorAllHabitats,
    isErrorPokemonByEggGroup, errorPokemonByEggGroup, isErrorPokemonByGender, errorPokemonByGender, isErrorPokemonByGrowthRate, errorPokemonByGrowthRate, isErrorPokemonByHabitat, errorPokemonByHabitat,
    isErrorCurrentPageDetails, showToast
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-zinc-950 flex flex-col items-center p-4 font-inter text-white">
      <h1 className="text-5xl font-bold text-white mb-8 drop-shadow-lg animate-fadeInDown">
        Advanced Search
      </h1>
      
      <div className="bg-gray-800 bg-opacity-90 rounded-xl shadow-lg p-6 text-white w-full max-w-5xl mb-8 animate-fadeInUp">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Filter Pokémon by Criteria</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="filter-group animate-slideInLeft">
                <label htmlFor="type-select" className="block text-left text-sm font-medium text-white mb-1">Filter by Type:</label>
                <select
                    id="type-select"
                    value={type}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    disabled={isLoadingTypes}
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">{isLoadingTypes ? 'Loading Types...' : 'All Types'}</option>
                    {(allTypes?.results || [])
                        .filter(t => t.name !== 'unknown' && t.name !== 'shadow')
                        .map(t => (
                            <option key={t.name} value={t.name}>
                                {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                            </option>
                        ))}
                </select>
            </div>

            <div className="filter-group animate-slideInLeft delay-100">
                <label htmlFor="generation-select" className="block text-left text-sm font-medium text-white mb-1">Filter by Generation:</label>
                <select
                    id="generation-select"
                    value={generation}
                    onChange={(e) => updateFilter('generation', e.target.value)}
                    disabled={isLoadingGenerations}
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">{isLoadingGenerations ? 'Loading Generations...' : 'All Generations'}</option>
                    {(allGenerations?.results || []).map(gen => (
                        <option key={gen.name} value={gen.name}>
                            {gen.name.replace('generation-', 'Generation ').toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group animate-slideInLeft delay-200">
                <label htmlFor="ability-select" className="block text-left text-sm font-medium text-white mb-1">Filter by Ability:</label>
                <select
                    id="ability-select"
                    value={ability}
                    onChange={(e) => updateFilter('ability', e.target.value)}
                    disabled={isLoadingAbilities}
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">{isLoadingAbilities ? 'Loading Abilities...' : 'All Abilities'}</option>
                    {(allAbilities?.results || []).map(ab => (
                        <option key={ab.name} value={ab.name}>
                            {ab.name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group animate-slideInLeft">
                <label htmlFor="egg-group-select" className="block text-left text-sm font-medium text-white mb-1">Filter by Egg Group:</label>
                <select
                    id="egg-group-select"
                    value={eggGroup}
                    onChange={(e) => updateFilter('eggGroup', e.target.value)}
                    disabled={isLoadingEggGroups}
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">{isLoadingEggGroups ? 'Loading Egg Groups...' : 'All Egg Groups'}</option>
                    {(allEggGroups?.results || []).map(group => (
                        <option key={group.name} value={group.name}>
                            {group.name.charAt(0).toUpperCase() + group.name.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group animate-slideInLeft delay-100">
                <label htmlFor="gender-select" className="block text-left text-sm font-medium text-white mb-1">Filter by Gender:</label>
                <select
                    id="gender-select"
                    value={gender}
                    onChange={(e) => updateFilter('gender', e.target.value)}
                    disabled={isLoadingGenders}
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">{isLoadingGenders ? 'Loading Genders...' : 'All Genders'}</option>
                    {(allGenders?.results || []).map(g => (
                        <option key={g.name} value={g.name}>
                            {g.name.charAt(0).toUpperCase() + g.name.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group animate-slideInLeft delay-200">
                <label htmlFor="growth-rate-select" className="block text-left text-sm font-medium text-white mb-1">Filter by Growth Rate:</label>
                <select
                    id="growth-rate-select"
                    value={growthRate}
                    onChange={(e) => updateFilter('growthRate', e.target.value)}
                    disabled={isLoadingGrowthRates}
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">{isLoadingGrowthRates ? 'Loading Growth Rates...' : 'All Growth Rates'}</option>
                    {(allGrowthRates?.results || []).map(rate => (
                        <option key={rate.name} value={rate.name}>
                            {rate.name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group col-span-1 md:col-span-2 lg:col-span-1 animate-slideInRight">
                <label htmlFor="habitat-select" className="block text-left text-sm font-medium text-white mb-1">Filter by Habitat:</label>
                <select
                    id="habitat-select"
                    value={habitat}
                    onChange={(e) => updateFilter('habitat', e.target.value)}
                    disabled={isLoadingHabitats}
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">{isLoadingHabitats ? 'Loading Habitats...' : 'All Habitats'}</option>
                    {(allHabitats?.results || []).map(h => (
                        <option key={h.name} value={h.name}>
                            {h.name.charAt(0).toUpperCase() + h.name.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group col-span-1 md:col-span-2 lg:col-span-1 animate-slideInRight">
                <label className="block text-left text-sm font-medium text-white mb-1">Height (m):</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minHeight}
                        onChange={(e) => updateFilter('minHeight', e.target.value)}
                        className="w-1/2 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white placeholder-gray-400"
                        min="0"
                        step="0.1"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxHeight}
                        onChange={(e) => updateFilter('maxHeight', e.target.value)}
                        className="w-1/2 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white placeholder-gray-400"
                        min="0"
                        step="0.1"
                    />
                </div>
            </div>

            <div className="filter-group col-span-1 md:col-span-2 lg:col-span-1 animate-slideInRight delay-100">
                <label className="block text-left text-sm font-medium text-white mb-1">Weight (kg):</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minWeight}
                        onChange={(e) => updateFilter('minWeight', e.target.value)}
                        className="w-1/2 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white placeholder-gray-400"
                        min="0"
                        step="0.1"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxWeight}
                        onChange={(e) => updateFilter('maxWeight', e.target.value)}
                        className="w-1/2 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white placeholder-gray-400"
                        min="0"
                    />
                </div>
            </div>

            <div className="filter-group col-span-1 md:col-span-2 lg:col-span-1 animate-slideInRight delay-200">
                <label className="block text-left text-sm font-medium text-white mb-1">Base Stat Total (BST):</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minBST}
                        onChange={(e) => updateFilter('minBST', e.target.value)}
                        className="w-1/2 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white placeholder-gray-400"
                        min="0"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxBST}
                        onChange={(e) => updateFilter('maxBST', e.target.value)}
                        className="w-1/2 p-3 rounded-xl border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm bg-gray-700 text-white placeholder-gray-400"
                        min="0"
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-center gap-4 mt-8 animate-fadeIn delay-400">
            <button
                onClick={clearFilters}
                className="bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl shadow-md hover:bg-gray-400 transition-all duration-200 transform hover:scale-105"
            >
                Clear All Filters
            </button>
        </div>

        {(isLoadingAllPokemonNames || isLoadingTypes || isLoadingGenerations || isLoadingAbilities || isLoadingPokemonByType || isLoadingPokemonByGeneration || isLoadingPokemonByAbility || isLoadingEggGroups || isLoadingGenders || isLoadingGrowthRates || isLoadingHabitats || isLoadingPokemonByEggGroup || isLoadingPokemonByGender || isLoadingPokemonByGrowthRate || isLoadingPokemonByHabitat) && (
            <div className="flex items-center justify-center text-white text-xl mt-8 animate-pulse">
                <svg className="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Filter Options...
            </div>
        )}
      </div>

      <>
          {!isLoadingFilterOptions && isLoadingCurrentPageDetails && (
              <div className="flex items-center justify-center text-white text-xl mt-8 animate-pulse">
                  <svg className="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching Pokémon details for current page...
              </div>
          )}

          {!isLoadingFilterOptions && !isLoadingCurrentPageDetails && showNoResultsMessage && (
              <p className="text-white text-lg mt-8 animate-fadeIn">No Pokémon found matching your criteria.</p>
          )}

          {!isLoadingFilterOptions && !isLoadingCurrentPageDetails && finalDisplayedPokemon.length > 0 && (
              <>
                  <h2 className="text-3xl font-bold text-white mb-6 mt-8 drop-shadow-lg animate-fadeInDown">
                      {isAnyFilterSelected ? `Filtered Results (${preliminaryFilteredNames.length} total, showing ${finalDisplayedPokemon.length} on this page)` : `All Pokémon (${preliminaryFilteredNames.length} total)`}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                      {finalDisplayedPokemon.map(pokemon => (
                          <PokemonCard key={pokemon.name} pokemon={pokemon} />
                      ))}
                  </div>

                  {preliminaryFilteredNames.length > itemsPerPage && (
                      <div className="flex justify-center gap-4 mt-8 w-full max-w-md">
                          <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          </button>
                          <span className="text-white text-lg font-semibold flex items-center">
                              Page {currentPage} of {totalPages}
                          </span>
                          <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                          </button>
                      </div>
                  )}
              </>
          )}
      </>
    </div>
  );
};

export default AdvancedSearchPage;