import React from 'react';

export default function ToggleButtons({ options, activeOption, onToggle }) {
  return (
    <div className="mb-4 flex flex-wrap justify-center gap-4">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            activeOption === option.value
              ? 'bg-purple-700 text-white'
              : 'border border-purple-500 text-purple-500'
          }`}
          onClick={() => onToggle(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
