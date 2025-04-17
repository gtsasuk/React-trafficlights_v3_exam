import React, { useContext } from "react";
import { TrafficLightsContext } from "../context/TrafficLightsContext";
import Light from "./Light";
import { motion } from "framer-motion";
import "../сss/TrafficLights.css"

const TrafficLights = () => {
  const { orientation, clickCounts, handleClick, settings } = useContext(TrafficLightsContext);

  return (
    <motion.div
      key={orientation}
      className={`traffic-light ${orientation}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {clickCounts.map((light) => (
        <Light key={light.id} tlColor={light.color} onClick={(e) => handleClick(light.color, e)} brightness={settings.brightness} blinkCount={settings.blinkCount} />
      ))}
    </motion.div>
  );
};

export default TrafficLights;
