import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useToastStore } from '../stores/toastStore';
import { useQuery } from '@tanstack/react-query'; 

const API_BASE_URL = 'https://pkmn.github.io/smogon/data'; 

const fetchSmogonData = async (endpoint, format = 'gen9ou') => {
  let url;
  
  if (endpoint === 'formats') {
    url = `${API_BASE_URL}/formats/index.json`;
  } else {
    
    
    url = `${API_BASE_URL}/${endpoint}/${format}.json`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint} data: ${response.statusText}`);
  }
  return response.json();
};

const SmogonApiExplorerPage = () => {
  const { showToast } = useToastStore();
  const [selectedEndpoint, setSelectedEndpoint] = useState('formats'); 

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [selectedEndpoint, 'gen9ou'], 
    queryFn: () => fetchSmogonData(selectedEndpoint, 'gen9ou'),
    staleTime: 5 * 60 * 1000, 
    enabled: !!selectedEndpoint, 
    onError: (err) => {
      showToast({
        message: `Error fetching data for ${selectedEndpoint}: ${err.message}`,
        type: 'error',
      });
    },
  });

  
  const formatList = (arr) => arr && arr.length > 0 ? arr.map(item => item.replace(/-/g, ' ')).join(', ') : 'N/A';
  const formatMoves = (moves) => moves && moves.length > 0 ? moves.join(', ') : 'N/A';

  const renderEndpointContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <p className="text-lg text-blue-300 animate-pulse">Loading {selectedEndpoint} data...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-8">
          <p className="text-lg text-red-500">Error: {error.message}</p>
          <p className="text-gray-400 text-sm mt-2">Could not load data for "{selectedEndpoint}". Please try again later or check the console for more details.</p>
        </div>
      );
    }

    
    if (!data) {
        return (
            <div className="text-center py-8">
                <p className="text-lg text-gray-400">No data available for "{selectedEndpoint}".</p>
            </div>
        );
    }

    switch (selectedEndpoint) {
      case 'formats':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4">Available Formats (IDs):</h3>
            <p className="text-gray-400 text-sm mb-4">This lists format IDs from the Smogon API. For detailed descriptions, you would need to consult Smogon's website or other resources as the API provides IDs for historical data.</p>
            <div className="bg-gray-700 p-4 rounded-lg shadow-inner max-h-96 overflow-y-auto">
              {data && Object.keys(data).length > 0 ? (
                <ul className="list-disc list-inside text-gray-300">
                  {Object.keys(data).map(formatId => (
                    <li key={formatId} className="mb-1">{formatId}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No format data available.</p>
              )}
            </div>
          </div>
        );

      case 'analyses':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4">Pokémon Analyses (Gen 9 OU - Default):</h3>
            <p className="text-gray-400 text-sm mb-4">
                The Smogon API provides analyses for specific Pokémon within a given format. This fetches a default set for "Gen 9 OU".
                Full analyses are very detailed; this display provides an overview.
            </p>
            {data && Object.keys(data).length > 0 ? (
              Object.entries(data).map(([pokemonName, analysis]) => (
                <div key={pokemonName} className="bg-gray-700 p-4 rounded-lg shadow-inner mb-3 last:mb-0">
                  <h4 className="text-xl font-semibold text-green-300 capitalize mb-2">{pokemonName.replace(/-/g, ' ')}</h4>
                  <p className="text-sm text-gray-300 mb-2">
                    <strong className="text-gray-200">Overview:</strong> {analysis.overview ? analysis.overview.substring(0, 200) + '...' : 'N/A'}
                  </p>
                  {analysis.commonSets && analysis.commonSets.length > 0 && (
                    <div className="mt-2">
                      <p className="font-bold text-gray-200 mb-1">Common Sets (first 2):</p>
                      {analysis.commonSets.slice(0, 2).map((set, setIndex) => (
                        <div key={setIndex} className="bg-gray-600 p-3 rounded-md mb-2 last:mb-0">
                          <p className="text-sm text-blue-300 font-semibold">{set.name || 'Unnamed Set'}</p>
                          <p className="text-xs text-gray-300"><strong className="text-gray-400">Item:</strong> {set.item || 'N/A'}</p>
                          <p className="text-xs text-gray-300"><strong className="text-gray-400">Ability:</strong> {set.ability || 'N/A'}</p>
                          <p className="text-xs text-gray-300"><strong className="text-gray-400">Moves:</strong> {formatMoves(set.moves)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {analysis.checksAndCounters && analysis.checksAndCounters.length > 0 && (
                    <p className="text-sm text-gray-300 mt-2"><strong className="text-gray-200">Checks & Counters:</strong> {formatList(analysis.checksAndCounters)}</p>
                  )}
                  {analysis.teammates && analysis.teammates.length > 0 && (
                    <p className="text-sm text-gray-300"><strong className="text-gray-200">Common Teammates:</strong> {formatList(analysis.teammates)}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No analysis data found for Gen 9 OU.</p>
            )}
          </div>
        );

      case 'sets':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4">Common Pokémon Sets (Gen 9 OU - Default):</h3>
            <p className="text-gray-400 text-sm mb-4">
                This displays common competitive sets for Pokémon in "Gen 9 OU".
            </p>
            {data && Object.keys(data).length > 0 ? (
              Object.entries(data).map(([pokemonName, sets]) => (
                <div key={pokemonName} className="bg-gray-700 p-4 rounded-lg shadow-inner mb-3 last:mb-0">
                  <h4 className="text-xl font-semibold text-green-300 capitalize mb-2">{pokemonName.replace(/-/g, ' ')}</h4>
                  {sets && sets.length > 0 ? (
                    sets.map((set, index) => (
                      <div key={index} className="bg-gray-600 p-3 rounded-md mb-2 last:mb-0">
                        <p className="font-bold text-lg text-blue-300 mb-1">{set.name || 'Unnamed Set'}</p>
                        <p className="text-sm text-gray-300"><strong className="text-gray-200">Item:</strong> {set.item || 'N/A'}</p>
                        <p className="text-sm text-gray-300"><strong className="text-gray-200">Ability:</strong> {set.ability || 'N/A'}</p>
                        <p className="text-sm text-gray-300"><strong className="text-gray-200">Moves:</strong> {formatMoves(set.moves)}</p>
                        <p className="text-sm text-gray-300"><strong className="text-gray-200">Nature:</strong> {set.nature || 'N/A'}</p>
                        <p className="text-sm text-gray-300"><strong className="text-gray-200">EVs:</strong> {set.evs ? Object.entries(set.evs).map(([stat, val]) => `${val} ${stat.toUpperCase()}`).join(' / ') : 'N/A'}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No sets available for this Pokémon.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No sets data found for Gen 9 OU.</p>
            )}
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4">Usage Statistics (Gen 9 OU - Default):</h3>
            <p className="text-gray-400 text-sm mb-4">
                This displays usage statistics for "Gen 9 OU".
            </p>
            {data && data.info && data.usage ? (
                <>
                    <p className="text-lg font-semibold text-blue-300">Format: <span className="capitalize">{data.info.metagame ? data.info.metagame.split(' ')[0] : 'N/A'}</span></p>
                    <p className="text-lg font-semibold text-blue-300">Month: {data.info.metagame ? data.info.metagame.split(' ')[1] : 'N/A'}</p>
                    <p className="text-lg font-semibold text-blue-300">Total Battles: {data.info.numberofbattles ? data.info.numberofbattles.toLocaleString() : 'N/A'}</p>

                    <div className="mt-4">
                        <h4 className="text-xl font-semibold text-yellow-200 mb-2">Top Pokémon Usage:</h4>
                        <div className="bg-gray-700 p-4 rounded-lg shadow-inner max-h-96 overflow-y-auto">
                            <table className="min-w-full text-left text-gray-300">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="py-2 px-1">Rank</th>
                                        <th className="py-2 px-2">Pokémon</th>
                                        <th className="py-2 px-2">Usage</th>
                                        <th className="py-2 px-2">Raw Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data.usage)
                                        .sort(([, a], [, b]) => b - a) 
                                        .slice(0, 20) 
                                        .map(([pokemonName, usageValue], index) => (
                                            <tr key={pokemonName} className="border-b border-gray-600 last:border-b-0">
                                                <td className="py-2 px-1">{index + 1}</td>
                                                <td className="py-2 px-2 capitalize">{pokemonName.replace(/-/g, ' ')}</td>
                                                <td className="py-2 px-2">{(usageValue * 100).toFixed(2)}%</td>
                                                <td className="py-2 px-2">{data.raw_counts[pokemonName] ? data.raw_counts[pokemonName].toLocaleString() : 'N/A'}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
              <p className="text-gray-400">No usage statistics found for Gen 9 OU.</p>
            )}
          </div>
        );

      case 'teams':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4">Sample Teams (Gen 9 OU - Default):</h3>
            <p className="text-gray-400 text-sm mb-4">
                This displays sample competitive teams for "Gen 9 OU". The data fetched is structured differently from the mock team archetypes.
            </p>
            {data && data.length > 0 ? (
              data.map((team, teamIndex) => (
                <div key={teamIndex} className="bg-gray-700 p-4 rounded-lg shadow-inner mb-4">
                  <h4 className="text-xl font-semibold text-yellow-200 mb-2">Team: {team.name || `Unnamed Team ${teamIndex + 1}`}</h4>
                  {team.author && <p className="text-sm text-gray-300 mb-2"><strong className="text-gray-200">Author:</strong> {team.author}</p>}
                  
                  {team.data && team.data.length > 0 ? (
                    <div className="space-y-3">
                      {team.data.map((pokemon, pokeIndex) => (
                        <div key={pokeIndex} className="bg-gray-600 p-3 rounded-md">
                          <p className="font-bold text-lg text-green-300 capitalize mb-1">{pokemon.species.replace(/-/g, ' ')}</p>
                          <p className="text-sm text-gray-300"><strong className="text-gray-200">Item:</strong> {pokemon.item || 'N/A'}</p>
                          <p className="text-sm text-gray-300"><strong className="text-gray-200">Ability:</strong> {pokemon.ability || 'N/A'}</p>
                          <p className="text-sm text-gray-300"><strong className="text-gray-200">Moves:</strong> {formatMoves(pokemon.moves)}</p>
                          {pokemon.nature && <p className="text-sm text-gray-300"><strong className="text-gray-200">Nature:</strong> {pokemon.nature}</p>}
                          {pokemon.evs && Object.keys(pokemon.evs).length > 0 &&
                            <p className="text-sm text-gray-300"><strong className="text-gray-200">EVs:</strong> {Object.entries(pokemon.evs).map(([stat, val]) => `${val} ${stat.toUpperCase()}`).join(' / ')}</p>
                          }
                          {pokemon.teraType && <p className="text-sm text-gray-300"><strong className="text-gray-200">Tera Type:</strong> {pokemon.teraType}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No Pokémon data found for this team.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No sample teams data found for Gen 9 OU.</p>
            )}
          </div>
        );

      default:
        return <p className="text-gray-400">Select an endpoint to view data.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-8 text-shadow-lg animate-fadeInDown">
          Smogon API Explorer
        </h1>
        
        <div className="bg-gray-800 bg-opacity-90 rounded-xl shadow-lg p-6 text-white text-center w-full max-w-3xl mb-8 animate-fadeInUp">
          <h2 className="text-2xl font-semibold mb-4">Select Smogon API Endpoint to Explore:</h2>
          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="formats">/formats - Available Format IDs</option>
            <option value="analyses">/analyses - Pokémon Analyses (Gen 9 OU)</option>
            <option value="sets">/sets - Common Pokémon Sets (Gen 9 OU)</option>
            <option value="stats">/stats - Usage Statistics (Gen 9 OU)</option>
            <option value="teams">/teams - Sample Teams (Gen 9 OU)</option>
          </select>
        </div>

        <div className="bg-gray-800 bg-opacity-90 rounded-xl shadow-lg p-6 text-white text-left w-full max-w-3xl animate-fadeIn">
          {renderEndpointContent()}
        </div>

        <p className="text-gray-400 text-sm mt-4">
            Data fetched from the unofficial <a href="https://pkmn.github.io/smogon/data/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">pkmn.github.io/smogon/data/</a> API.
            Specific endpoints like analyses, sets, and stats typically require more granular queries (e.g., specific Pokémon or formats)
            which are not fully implemented in this basic explorer and currently default to "Gen 9 OU" or general listings.
        </p>
      </div>
    </div>
  );
};

export default SmogonApiExplorerPage;
