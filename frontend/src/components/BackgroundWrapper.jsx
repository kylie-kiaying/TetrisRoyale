// Reusable background wrapper component for abstraction

import React from "react";

const BackgroundWrapper = ({ children }) => {
    return (
        <div
            className="min-h-screen flex flex-col items-center px-4 bg-fixed bg-center bg-cover bg-no-repeat"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
            }}
        >
            {children}
        </div>
    );
};

export default BackgroundWrapper;
