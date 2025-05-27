/**
 * Format number with K/M suffix for compact display
 * 
 * @param num - The number to format
 * @returns Formatted number string with appropriate suffix (1.2K, 3.5M, etc.)
 */
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export default formatNumber;
