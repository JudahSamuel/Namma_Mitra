'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProjectMitraAnim = () => {
  const TARGET_TEXT = "PROJECT MITRA";
  const CYCLES_PER_LETTER = 3; // How many scrambles before revealing the letter
  const SHUFFLE_SPEED = 40; // Speed in ms
  const CHARS = "!@#$%^&*():{};|,.<>/?XYZ0123456789";

  const [displayText, setDisplayText] = useState(TARGET_TEXT);
  const [isAnimating, setIsAnimating] = useState(false);

  const scramble = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    let pos = 0;
    const interval = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (char === " ") return " "; // Keep spaces
          if (pos / CYCLES_PER_LETTER > index) {
            return char; // Reveal correct char
          }
          const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          return randomChar;
        })
        .join("");

      setDisplayText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        clearInterval(interval);
        setDisplayText(TARGET_TEXT);
        setIsAnimating(false);
      }
    }, SHUFFLE_SPEED);
  };

  // Run on mount (when page loads)
  useEffect(() => {
    scramble();
  }, []);

  return (
    <motion.div
      onMouseEnter={scramble} // Run again on hover
      className="relative cursor-default"
    >
      <h3 className="font-black text-lg tracking-wide text-white relative z-10">
        {displayText}
      </h3>
      {/* Subtle Glow Effect behind text */}
      <div className="absolute inset-0 bg-violet-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-10000"></div>
    </motion.div>
  );
};

export default ProjectMitraAnim;