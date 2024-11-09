export function getPlayerTier(rating) {
  if (rating >= 2200) {
    return { tier: 'Champion', color: 'text-yellow-500' }; // Gold
  } else if (rating >= 1900) {
    return { tier: 'Master', color: 'text-purple-500' }; // Royal Purple
  } else if (rating >= 1600) {
    return { tier: 'Diamond', color: 'text-cyan-400' }; // Cyan Blue
  } else if (rating >= 1400) {
    return { tier: 'Platinum', color: 'text-blue-300' }; // Steel Silver
  } else if (rating >= 1200) {
    return { tier: 'Gold', color: 'text-orange-500' }; // Adjusted to yellow-500 for brighter gold
  } else if (rating >= 1000) {
    return { tier: 'Silver', color: 'text-gray-500' }; // Slate Gray
  } else if (rating >= 800) {
    return { tier: 'Bronze', color: 'text-orange-400' }; // Sandy Brown
  } else {
    return { tier: 'Unranked', color: 'text-gray-300' }; // Light Gray
  }
}
