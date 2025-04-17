import React, { useEffect, useState, useContext } from "react";
import { TrafficLightsContext } from "../context/TrafficLightsContext";
import "../сss/PedestrianTrafficLight.css"

const PedestrianTrafficLight = () => {
  const [pedestrianState, setPedestrianState] = useState("wait");
  const [isBlocked, setIsBlocked] = useState(false);
  const { currentLightState, setTrafficLightState } = useContext(TrafficLightsContext);

  useEffect(() => {
    if (currentLightState?.toLowerCase() === "green") {
      setPedestrianState("wait");
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, [currentLightState]);


  useEffect(() => {
    if (pedestrianState === "go") {
      // Для пішоходів "go" — авто повинно зупинитись → червоне світло
      setTrafficLightState("Red");
    } else if (pedestrianState === "wait") {
      // Пішоходи чекають → авто їде → зелене світло
      setTrafficLightState("Green");
    }
  }, [pedestrianState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPedestrianState((prev) => {
        if (!isBlocked) {
          return prev === "wait" ? "go" : "wait";
        }
        return prev;
      });
    }, 10000);
  
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    if (!isBlocked) {
      setPedestrianState((prev) => (prev === "wait" ? "go" : "wait"));
    }
  };

  return (
    <div className="pedestrian-traffic-light">
      <div className={`pedestrian-light ${pedestrianState === "wait" ? "red" : "grey"}`}>Wait</div>
      <div className={`pedestrian-light ${pedestrianState === "go" ? "green" : "grey"}`}>Go</div>
      <button onClick={handleToggle} disabled={isBlocked} className="pedestrian-btn">
        Switch
      </button>
    </div>
  );
};

export default PedestrianTrafficLight;
