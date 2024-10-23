// components/ExpandedMatchDetails.jsx
import useAuthStore from '@/store/authStore';
import React from 'react';

export function ExpandedMatchDetails({ rowData }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Pieces and PPS */}
      <div className="border-b border-gray-700 py-2">
        <p className="text-sm font-semibold">Pieces Placed</p>
        <p className="text-lg">{rowData.pieces_placed}</p>
      </div>
      <div className="border-b border-gray-700 py-2">
        <p className="text-sm font-semibold">PPS (Pieces Per Second)</p>
        <p className="text-lg">{rowData.pps}</p>
      </div>

      {/* APM and KPP */}
      <div className="border-b border-gray-700 py-2">
        <p className="text-sm font-semibold">APM (Attacks Per Minute)</p>
        <p className="text-lg">{rowData.apm}</p>
      </div>
      <div className="border-b border-gray-700 py-2">
        <p className="text-sm font-semibold">KPP (Keys Per Piece)</p>
        <p className="text-lg">{rowData.kpp}</p>
      </div>

      {/* Finesse and Lines */}
      <div className="border-b border-gray-700 py-2">
        <p className="text-sm font-semibold">Finesse %</p>
        <p className="text-lg">{rowData.finesse_percentage}</p>
      </div>
      <div className="border-b border-gray-700 py-2">
        <p className="text-sm font-semibold">Lines Cleared</p>
        <p className="text-lg">{rowData.lines_cleared}</p>
      </div>
    </div>
  );
}
