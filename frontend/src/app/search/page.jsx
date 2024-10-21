// pages/SearchPage.jsx
"use client";

import React, { useState } from "react";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/ui/SearchBar";

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOption, setSelectedOption] = useState("Players");

    const handleSearch = (e) => {
        e.preventDefault();
        console.log(`Searching for "${searchQuery}" in ${selectedOption}`);
        // Implement your search logic here
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
                    />
                </div>
            </div>
        </BackgroundWrapper>
    );
}
