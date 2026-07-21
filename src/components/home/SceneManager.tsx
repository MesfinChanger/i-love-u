"use client";

import { useEffect, useState } from "react";

import FlowerScene from "./scenes/FlowerScene";
import ForestScene from "./scenes/ForestScene";
import WaterfallScene from "./scenes/WaterfallScene";
import SunriseScene from "./scenes/SunriseScene";
import NightScene from "./scenes/NightScene";


const scenes = [
  FlowerScene,
  ForestScene,
  WaterfallScene,
  SunriseScene,
  NightScene,
];


export default function SceneManager(){

  const [index,setIndex] = useState(0);


  useEffect(()=>{

    const timer=setInterval(()=>{

      setIndex(
        old => (old + 1) % scenes.length
      );

    },30000);


    return ()=>clearInterval(timer);

  },[]);


  const Scene = scenes[index];


  return (

    <div
      className="
      absolute
      inset-0
      transition-opacity
      duration-1000
      "
    >

      <Scene />

    </div>

  );

}
