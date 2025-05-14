import { useTheme } from "@/context/ThemeContext";
import { GlassmorphismStyles } from "@/types";

/**
 * A hook that provides glassmorphism style classes based on the current theme
 */
export function useGlassmorphism(): GlassmorphismStyles {
  const { theme } = useTheme();
  
  if (theme === 'dark') {
    return {
      className: 'glass-dark',
      style: {
        background: 'rgba(20, 20, 20, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      },
    };
  } else {
    return {
      className: 'glass-light',
      style: {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      },
    };
  }
}
