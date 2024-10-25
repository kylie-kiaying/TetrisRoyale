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
    const [tournaments, setTournaments] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]); // Filtered results displayed to the user
    const [hasSearched, setHasSearched] = useState(false);

    const [hasFetchedPlayers, setHasFetchedPlayers] = useState(false);
    const [hasFetchedTournaments, setHasFetchedTournaments] = useState(false);
    const [hasFetchedOrganizers, setHasFetchedOrganizers] = useState(false);

    useEffect(() => {
        setFilteredResults([]);
        setHasSearched(false);
    }, [selectedOption]);

    const [suggestions, setSuggestions] = useState([]);
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSuggestions([]);
            return;
        }

        const dataToSearch =
            selectedOption === "Players" ? players : tournaments;
        const key =
            selectedOption === "Players" ? "username" : "tournament_name";

        const filteredSuggestions = dataToSearch
            .map((item) => ({
                item,
                similarity: distance(
                    searchQuery.toLowerCase(),
                    item[key].toLowerCase()
                ),
            }))
            .sort((a, b) => a.similarity - b.similarity)
            .slice(0, 3)
            .map((entry) => entry.item);

        setSuggestions(filteredSuggestions);
    }, [searchQuery, selectedOption, players, tournaments]);

    const fetchData = async (selectedOption) => {
        if (selectedOption === "Players" && !hasFetchedPlayers) {
            const response = await fetch("http://localhost:8002/players");
            const data = await response.json();
            setPlayers(data);
            setHasFetchedPlayers(true);
            return data; // Return the data after fetching
        } else if (selectedOption === "Tournaments" && !hasFetchedTournaments) {
            const response = await fetch("http://localhost:8003/tournaments");
            const data = await response.json();
            setTournaments(data);
            setHasFetchedTournaments(true);
            return data;
        } else if (selectedOption === "TOs" && !hasFetchedOrganizers) {
            // Fetch organizers and return data
        } else {
            // If data has already been fetched, just return the existing dataset
            return selectedOption === "Players"
                ? players
                : selectedOption === "Tournaments"
                  ? tournaments
                  : organizers;
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        console.log(`Searching for "${searchQuery}" in ${selectedOption}`);

        // Fetch the relevant data before filtering
        const data = await fetchData(selectedOption);
        const query = searchQuery.toLowerCase();

        // Filter based on the selected option and search query
        const filtered = data.filter((item) => {
            if (selectedOption === "Players") {
                return item.username.toLowerCase().includes(query);
            } else if (selectedOption === "Tournaments") {
                return (
                    item.tournament_name.toLowerCase().includes(query) ||
                    item.remarks.toLowerCase().includes(query) ||
                    item.status.toLowerCase().includes(query)
                );
            }
            return false;
        });
        setFilteredResults(filtered);
        setHasSearched(true);
    };

    const isResultsValid =
        filteredResults.length > 0 &&
        ((selectedOption === "Players" &&
            filteredResults.every((item) => item.username)) ||
            (selectedOption === "Tournaments" &&
                filteredResults.every((item) => item.tournament_name)));

    // Handle click on a suggestion
    const handleSuggestionClick = (suggestion) => {
        const key =
            selectedOption === "Players" ? "username" : "tournament_name";
        setSearchQuery(suggestion[key]); // Update search query with the suggestion
        setFilteredResults([suggestion]); // Update search results to show the clicked suggestion
        setSuggestions([]); // Clear suggestions
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

                {/* Render DataTable */}
                <div className="mt-8 max-w-4xl mx-auto w-full">
                    {selectedOption === "Players" &&
                        hasSearched &&
                        isResultsValid &&
                        filteredResults.length > 0 && (
                            <DataTable type="players" data={filteredResults} />
                        )}

                    {selectedOption === "Tournaments" &&
                        hasSearched &&
                        isResultsValid &&
                        filteredResults.length > 0 && (
                            <DataTable type="all" data={filteredResults} />
                        )}

                    {/* Display a message if no results are found */}
                    {hasSearched && filteredResults.length === 0 && (
                        <p className="text-center text-gray-400">
                            No results found.
                        </p>
                    )}
                </div>
            </div>
        </BackgroundWrapper>
    );
}
