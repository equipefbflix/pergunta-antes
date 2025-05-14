import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative inline-block w-12 mr-2 align-middle select-none">
        <input 
          type="checkbox" 
          id="toggleTheme" 
          className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-primary transition-all duration-300"
          style={{ top: 0 }}
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <label 
          htmlFor="toggleTheme" 
          className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-primary"
        />
      </div>
      <label htmlFor="toggleTheme" className="text-xs text-gray-700 dark:text-gray-300">
        {theme === 'dark' ? 'Escuro' : 'Claro'}
      </label>
    </div>
  );
}

export default ThemeToggle;
