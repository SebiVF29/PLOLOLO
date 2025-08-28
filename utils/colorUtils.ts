export const getTextColorForBackground = (hexColor: string): '#ffffff' | '#000000' => {
  if (!hexColor || hexColor.length < 7) return '#000000';
  
  try {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Formula for calculating luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  } catch (e) {
    console.error("Could not parse hex color", hexColor, e);
    return '#000000';
  }
};
