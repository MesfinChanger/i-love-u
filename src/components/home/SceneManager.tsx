
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlowerScene from "./scenes/FlowerScene";
import WaterfallScene from "./scenes/WaterfallScene";
import ForestScene from "./scenes/ForestScene";

/**
 * @fileOverview Nature Scene Manager.
 * Orchestrates high-fidelity transitions between Flower Farm, Waterfall, and Forest.
 */
const scenes = [
  { id: "flowers", component: FlowerScene },
  { id: "waterfall", component: WaterfallScene },
  { id: "forest", component: ForestScene },
];

export default function SceneManager() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((old) => (old + 1) % scenes.length);
    }, 15000); // 15 seconds per nature scene

    return () => clearInterval(timer);
  }, []);

  const ActiveScene = scenes[current].component;

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={scenes[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <ActiveScene />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
