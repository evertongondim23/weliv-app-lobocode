// Weliv Brand Colors
export const welivColors = {
  // Primary Colors
  orangePrimary: '#FFA500',
  orangeDark: '#FF8C00',
  yellow: '#FFC700',
  yellowLight: '#FFC700',
  
  // Text Colors
  brownDark: '#4A3728',
  brownLight: '#6B5D53',
  
  // Background Colors
  bgLight: '#FAFAFA',
  bgSecondary: '#FFF8E7',
  bgAccent: '#FFE5B4',
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
    secondary: 'linear-gradient(135deg, #FFC700 0%, #FFA500 100%)',
    tertiary: 'linear-gradient(135deg, #FFC700 0%, #FF8C00 100%)',
    soft: 'linear-gradient(135deg, #FFF8E7 0%, #FFE5B4 100%)',
    background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE5B4 50%, #FFD7A5 100%)',
  },
  
  // Utilities
  withOpacity: (color: string, opacity: number) => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
};

// Helper function for border colors
export const welivBorder = (opacity: number = 0.2) => `rgba(255, 165, 0, ${opacity})`;

// Helper function for gradient backgrounds
export const getGradientStyle = (gradient: keyof typeof welivColors.gradients) => ({
  background: welivColors.gradients[gradient],
});
