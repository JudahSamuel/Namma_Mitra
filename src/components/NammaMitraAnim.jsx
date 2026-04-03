'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NammaMitraAnim = () => {
  const [isKannada, setIsKannada] = useState(false);

  useEffect(() => {
    // Flip every 3 seconds
    const interval = setInterval(() => {
      setIsKannada((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="font-creative text-2xl font-bold tracking-tight flex items-center gap-1.5 leading-none text-slate-900 cursor-default">
      {/* CONSTANT TEXT */}
      <span>NAMMA</span>

      {/* FLIPPING TEXT CONTAINER */}
      <div className="relative h-[24px] min-w-[70px]"> 
        <AnimatePresence mode="wait">
          <motion.span
            key={isKannada ? "kannada" : "english"}
            initial={{ rotateX: -90, opacity: 0, y: 5 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            exit={{ rotateX: 90, opacity: 0, y: -5 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute left-0 top-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 origin-center"
          >
            {isKannada ? "ಮಿತ್ರ" : "MITRA"}
          </motion.span>
        </AnimatePresence>
      </div>
    </h1>
  );
};

export default NammaMitraAnim;