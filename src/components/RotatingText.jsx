'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <--- UPDATED IMPORT

const RotatingText = ({
  texts = [],
  mainClassName = "",
  staggerFrom = "last",
  initial = { y: "100%" },
  animate = { y: 0 },
  exit = { y: "-120%" },
  transition = { type: "spring", damping: 30, stiffness: 400 },
  rotationInterval = 2000,
  splitBy = "characters",
  staggerDuration = 0.05,
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(intervalId);
  }, [texts, rotationInterval]);

  const currentText = texts[index];

  return (
    <span className={`inline-flex relative ${mainClassName} justify-start`}>
      <span className="sr-only">{currentText}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="flex flex-wrap whitespace-nowrap"
          layout
        >
          {currentText.split(splitBy === "characters" ? "" : " ").map((word, i) => (
            <motion.span
              key={i}
              initial={initial}
              animate={{ ...animate, opacity: 1 }}
              exit={{ ...exit, opacity: 0 }}
              transition={{
                ...transition,
                delay: i * staggerDuration,
              }}
              className="inline-block"
            >
              {word === " " ? "\u00A0" : word}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;