import React, { useEffect } from 'react';
import { motion } from "framer-motion";

interface AppInitializationProps {
  type: 'init' | 'public';
  view?: string;
}

export function AppInitialization({ type, view = 'Document' }: AppInitializationProps) {
  // Apply theme from localStorage directly — component renders outside WorkspaceProvider
  useEffect(() => {
    const t = localStorage.getItem('erd-builder-theme');
    const root = document.documentElement;
    const body = document.body;
    const isDark = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.colorScheme = 'dark';
      body.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.style.colorScheme = 'light';
      body.style.colorScheme = 'light';
    }

    // Also watch for system changes while this component is mounted (pre-hydration)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (localStorage.getItem('erd-builder-theme') !== 'light') {
        if (mediaQuery.matches) {
          root.classList.add('dark');
          body.classList.add('dark');
          root.style.colorScheme = 'dark';
          body.style.colorScheme = 'dark';
        } else {
          root.classList.remove('dark');
          body.classList.remove('dark');
          root.style.colorScheme = 'light';
          body.style.colorScheme = 'light';
        }
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="h-screen w-screen bg-background flex flex-col items-center justify-center gap-5 overflow-hidden select-none">
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: [1, 1.05, 1], opacity: 1 }}
        transition={{
          scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
        className="relative flex items-center justify-center"
      >
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl pointer-events-none" />
        <img
          src="/logo.png"
          alt="PRD PRO"
          className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]"
        />
      </motion.div>

      <div className="flex flex-col items-center gap-3 z-10">
        <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          PRD PRO
        </span>

        {type === 'public' && (
          <p className="text-xs text-muted-foreground -mt-1">
            Loading shared {view}…
          </p>
        )}

        <div className="w-28 h-1 bg-muted/60 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "70%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
