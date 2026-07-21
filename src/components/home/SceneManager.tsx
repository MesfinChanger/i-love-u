"use client";

import { useEffect, useState } from "react";

import SunriseScene from "./scenes/SunriseScene";
import FlowerScene from "./scenes/FlowerScene";
import WaterfallScene from "./scenes/WaterfallScene";
import ForestScene from "./scenes/ForestScene";
import NightScene from "./scenes/NightScene";

const scenes = [
  SunriseScene,
  FlowerScene,
  WaterfallScene,
  ForestScene,
  NightScene,
];

export default function SceneManager() {

  const [current, setCurrent] = useState(0);

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrent((prev) => 
        (prev + 1) % scenes.length
      );

    }, 30000);

    return () => clearInterval(timer);

  }, []);

  const CurrentScene = scenes[current];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <CurrentScene />
    </div>
  );
}
