"use client";

import React, { useEffect, useState } from "react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/ui/SearchBar";
import { DataTable } from "@/components/ui/data-table";
import { distance } from "fastest-levenshtein";

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOption, setSelectedOption] = useState("Players");
    const [players, setPlayers] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [hasFetchedPlayers, setHasFetchedPlayers] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        setFilteredResults([]);
        setHasSearched(false);
    }, [selectedOption]);

    useEffect(() => {
        fetchData(selectedOption);
    }, [selectedOption]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSuggestions([]);
            return;
        }

        const exactMatches = players.filter((item) =>
            item.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const similarMatches = players
            .filter((item) => !exactMatches.includes(item))
            .map((item) => ({
                item,
                similarity: distance(
                    searchQuery.toLowerCase(),
                    item.username.toLowerCase()
                ),
            }))
            .sort((a, b) => a.similarity - b.similarity)
            .map((entry) => entry.item);

        setSuggestions([...exactMatches, ...similarMatches].slice(0, 3));
    }, [searchQuery, selectedOption, players]);

    const fetchData = async (selectedOption) => {
        if (selectedOption === "Players" && !hasFetchedPlayers) {
            const response = await fetch("http://localhost:8002/players");
            const data = await response.json();
            setPlayers(data);
            setHasFetchedPlayers(true);
        }
    };

    const fetchRatings = async (playerIds) => {
        const ratingsPromises = playerIds.map(async (user_id) => {
            const response = await fetch(`http://localhost:8005/ratings/${user_id}`);
            const ratingData = await response.json();
            return { user_id, rating: parseFloat(ratingData.rating).toFixed(2) };
        });
        return await Promise.all(ratingsPromises);
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        const filtered = players.filter((player) =>
            player.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const playerIds = filtered.map((player) => player.user_id);

        const ratings = await fetchRatings(playerIds);

        const resultsWithRatings = filtered.map((player) => {
            const rating = ratings.find((r) => r.user_id === player.user_id)?.rating || "N/A";
            return { ...player, rating };
        });

        setFilteredResults(resultsWithRatings);
        setHasSearched(true);
    };

    const isResultsValid =
        filteredResults.length > 0 && filteredResults.every((item) => item.username);

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.username);
        setFilteredResults([suggestion]);
        setSuggestions([]);
    };

    return (
        <BackgroundWrapper>
            <Navbar />
            <div className="container mx-auto px-4 py-16">
                <div className="flex max-w-2xl mx-auto w-full">
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        handleSearch={handleSearch}
                        suggestions={suggestions}
                        onSuggestionClick={handleSuggestionClick}
                    />
                </div>

                <div className="mt-8 max-w-4xl mx-auto w-full">
                    {selectedOption === "Players" &&
                        hasSearched &&
                        isResultsValid &&
                        filteredResults.length > 0 && (
                            <DataTable type="players" data={filteredResults} />
                        )}

                    {hasSearched && filteredResults.length === 0 && (
                        <p className="text-center text-gray-400">No results found.</p>
                    )}
                </div>
            </div>
        </BackgroundWrapper>
    );
}
