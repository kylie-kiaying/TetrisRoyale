"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";

export default function SearchBar({
    searchQuery,
    setSearchQuery,
    selectedOption,
    setSelectedOption,
    handleSearch,
    suggestions,
    onSuggestionClick,
}) {
    const [focused, setFocused] = useState(false);
    const formRef = useRef(null); // Reference to the form element

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        // Delay blur handling to check if the new focus is inside the form
        setTimeout(() => {
            if (
                formRef.current &&
                !formRef.current.contains(document.activeElement)
            ) {
                setFocused(false);
            }
        }, 100);
    };

    return (
        <div className="w-full relative">
            <form
                ref={formRef} // Attach the ref to the form
                onSubmit={handleSearch}
                onFocus={handleFocus} // Track focus for any child element
                onBlur={handleBlur} // Track blur and ensure that focus moved outside the form
                className="relative flex flex-wrap items-center w-full"
            >
                <div className="relative flex-grow w-full sm:w-auto">
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10 pr-32 py-2 w-full rounded-r-none border-r-0 bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 ${
                            focused
                                ? "border-purple-500 focus:ring-purple-500"
                                : "focus:border-gray-700 focus:ring-gray-700"
                        }`}
                    />
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                </div>
                <div className="relative w-full sm:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className={`rounded-l-none border border-l-0 h-[36px] min-w-[100px] font-normal justify-between bg-gray-800 text-gray-100 ${
                                    focused
                                        ? "border-purple-500"
                                        : "border-gray-700"
                                } hover:bg-gray-700 w-full`}
                            >
                                {selectedOption}
                                <ChevronDown size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-[100px] bg-gray-800 text-gray-100 border-gray-700"
                        >
                            <DropdownMenuItem
                                onClick={() => setSelectedOption("Players")}
                                className="hover:bg-gray-700 focus:bg-gray-700"
                            >
                                Players
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSelectedOption("Tournaments")}
                                className="hover:bg-gray-700 focus:bg-gray-700"
                            >
                                Tournaments
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSelectedOption("TOs")}
                                className="hover:bg-gray-700 focus:bg-gray-700"
                            >
                                TOs
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className={`ml-0 sm:ml-2 w-full sm:w-auto mt-2 sm:mt-0 ${
                        searchQuery.trim()
                            ? "bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 text-white"
                            : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                >
                    Search
                </Button>
            </form>

            {/* Suggestions dropdown */}
            {focused && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg z-20 overflow-hidden">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => onSuggestionClick(suggestion)}
                            className="px-4 py-2 hover:bg-purple-100 cursor-pointer transition-all duration-200 ease-in-out"
                        >
                            <span className="text-gray-5700">
                                {selectedOption === "Players"
                                    ? suggestion.username
                                    : suggestion.tournament_name}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
