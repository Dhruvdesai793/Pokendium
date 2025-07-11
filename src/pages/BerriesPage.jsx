import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToastStore } from '../stores/toastStore';

const BerriesPage = () => {
    const { showToast } = useToastStore();
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const { data: berryListData, isLoading, isError, error } = useQuery({
        queryKey: ['berryList', offset],
        queryFn: async () => {
            const response = await fetch(`https://pokeapi.co/api/v2/berry/?limit=${limit}&offset=${offset}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch berries: ${response.statusText}`);
            }
            const data = await response.json();
            return { results: data.results, count: data.count };
        },
        staleTime: 5 * 60 * 1000,
        keepPreviousData: true,
    });

    const berryDetailsQueries = useQuery({
        queryKey: ['berryDetails', berryListData?.results.map(b => b.name).join('-')],
        queryFn: async () => {
            if (!berryListData?.results) return [];
            const detailsPromises = berryListData.results.map(async (berry) => {
                const response = await fetch(berry.url);
                if (!response.ok) {
                    return {
                        name: berry.name,
                        firmness: 'Unknown',
                        growth_time: 'N/A',
                        max_harvest: 'N/A',
                        natural_gift_power: 'N/A',
                        size: 'N/A',
                        smoothness: 'N/A',
                        soil_dryness: 'N/A',
                        flavors: [],
                    };
                }
                const data = await response.json();
                return {
                    name: data.name,
                    firmness: data.firmness?.name.replace(/-/g, ' ').toUpperCase() || 'N/A',
                    growth_time: data.growth_time || 'N/A',
                    max_harvest: data.max_harvest || 'N/A',
                    natural_gift_power: data.natural_gift_power || 'N/A',
                    size: data.size || 'N/A',
                    smoothness: data.smoothness || 'N/A',
                    soil_dryness: data.soil_dryness || 'N/A',
                    flavors: data.flavors || [],
                };
            });
            return Promise.all(detailsPromises);
        },
        enabled: !!berryListData?.results,
        staleTime: 5 * 60 * 1000,
        keepPreviousData: true,
    });

    const { data: berryDetailsData, isLoading: isLoadingDetails, isError: isErrorDetails, error: errorDetails } = berryDetailsQueries;

    useEffect(() => {
        if (isError) {
            showToast({ message: 'Failed to fetch berry list.', type: 'error' });
            console.error("Berry list fetch error:", error);
        }
        if (isErrorDetails) {
            showToast({ message: 'Failed to fetch berry details.', type: 'error' });
            console.error("Berry details fetch error:", errorDetails);
        }
    }, [isError, isErrorDetails, error, errorDetails, showToast]);

    const totalCount = berryListData?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const handlePreviousPage = () => {
        setOffset(prev => Math.max(0, prev - limit));
    };

    const handleNextPage = () => {
        setOffset(prev => Math.min(totalCount - (totalCount % limit), prev + limit));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 font-sans pt-20">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

            <div className="relative z-10 container mx-auto px-4">
                <h1 className="text-5xl font-bold text-center mb-8 text-shadow-lg animate-fadeInDown">
                    Berry Dex
                </h1>

                {isLoading || isLoadingDetails ? (
                    <div className="text-center text-xl">Loading berries...</div>
                ) : (isError || isErrorDetails) ? (
                    <div className="text-center text-xl text-red-500">Error loading berries. Please try again later.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8 animate-fadeInUp">
                            {berryDetailsData && berryDetailsData.map((berry) => (
                                <div
                                    key={berry.name}
                                    className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200 flex flex-col items-center text-center border border-gray-700"
                                >
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berries/${berry.name}-berry.png`}
                                        alt={berry.name}
                                        className="w-24 h-24 object-contain mb-2"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150/000000/FFFFFF?text=No+Image'; }}
                                    />
                                    <h2 className="text-2xl font-semibold mb-2 capitalize text-blue-400">{berry.name}</h2>
                                    <p className="text-gray-300"><strong>Firmness:</strong> {berry.firmness}</p>
                                    <p className="text-gray-300"><strong>Growth Time:</strong> {berry.growth_time} hours</p>
                                    <p className="text-gray-300"><strong>Max Harvest:</strong> {berry.max_harvest}</p>
                                    <p className="text-gray-300"><strong>Natural Gift Power:</strong> {berry.natural_gift_power}</p>
                                    <p className="text-gray-300"><strong>Size:</strong> {berry.size} mm</p>
                                    <p className="text-gray-300"><strong>Smoothness:</strong> {berry.smoothness}</p>
                                    <p className="text-gray-300"><strong>Soil Dryness:</strong> {berry.soil_dryness}</p>
                                    {berry.flavors && berry.flavors.length > 0 && (
                                        <p className="text-gray-300">
                                            <strong>Flavors:</strong> {berry.flavors.map(f => `${f.flavor.name} (potency: ${f.potency})`).join(', ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center items-center space-x-4 mt-8">
                            <button
                                onClick={handlePreviousPage}
                                disabled={offset === 0 || isLoading || isLoadingDetails}
                                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                            </button>
                            <span className="text-white text-lg font-semibold flex items-center">
                                Page {Math.floor(offset / limit) + 1} of {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={offset + limit >= totalCount || isLoading || isLoadingDetails}
                                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BerriesPage;