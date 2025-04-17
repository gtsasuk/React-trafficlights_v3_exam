import React, { useEffect, useState, useContext } from "react";
import { TrafficLightsContext } from "../context/TrafficLightsContext";
import "../сss/PedestrianTrafficLight.css"

const PedestrianTrafficLight = () => {
  const [pedestrianState, setPedestrianState] = useState("wait");
  const [isBlocked, setIsBlocked] = useState(false);
  const { currentLightState } = useContext(TrafficLightsContext);

  useEffect(() => {
    if (currentLightState?.toLowerCase() === "green") {
      setPedestrianState("wait");
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, [currentLightState]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBlocked) {
        setPedestrianState((prev) => (prev === "wait" ? "go" : "wait"));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isBlocked]);

  const handleToggle = () => {
    if (!isBlocked) {
      setPedestrianState((prev) => (prev === "wait" ? "go" : "wait"));
    }
  };

  return (
    <div className="pedestrian-traffic-light">
      <div className={`pedestrian-light ${pedestrianState === "wait" ? "red" : "grey"}`}>Чекай</div>
      <div className={`pedestrian-light ${pedestrianState === "go" ? "green" : "grey"}`}>Йди</div>
      <button onClick={handleToggle} disabled={isBlocked} className="pedestrian-btn">
        Перемкнути
      </button>
    </div>
  );
};

export default PedestrianTrafficLight;
