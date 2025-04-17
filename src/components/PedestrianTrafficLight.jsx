import React, { useEffect, useState, useContext } from "react";
import { TrafficLightsContext } from "../context/TrafficLightsContext";
import "../сss/PedestrianTrafficLight.css";

const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxbmKq8mPeFIOrN-e02iJG_tY7OmMyuxnUVmM4GyvEvf56hkA68HIvpbIQzsQhRuc8rWg/exec";

const PedestrianTrafficLight = () => {
  const {
    orientation,
    pedestrianStateFromGoogle,
    setTrafficLightState,
    currentLightState,
  } = useContext(TrafficLightsContext);

  const [pedestrianState, setPedestrianState] = useState("wait");
  const [pedestrianId, setPedestrianId] = useState(null);

  useEffect(() => {
    const stateObj = pedestrianStateFromGoogle?.[0];
    if (stateObj) {
      setPedestrianState(stateObj.state.toLowerCase());
      setPedestrianId(stateObj.id);
    }
  }, [pedestrianStateFromGoogle]);

  const updatePedestrianState = (newState) => {
    if (!pedestrianId) return;

    fetch(GOOGLE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "updateState",
        id: pedestrianId,
        state: newState.charAt(0).toUpperCase() + newState.slice(1),
      }),
    })
      .then(() => setPedestrianState(newState))
      .catch((error) => console.error("Error updating pedestrian state:", error));
  };

  const switchState = () => {
    const newState = pedestrianState === "wait" ? "go" : "wait";
    updatePedestrianState(newState);
  
    if (newState === "go") {
      if (currentLightState === "Green") {
        setTrafficLightState("Red");
      }
    } else {
      setTrafficLightState("Green");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      switchState();
    }, 10000);
  
    return () => clearInterval(interval);
  }, [currentLightState, pedestrianState]);

  return (
    <div className={`pedestrian-traffic-light ${orientation}-pedestrian`}>
      <div className={`pedestrian-light ${pedestrianState === "wait" ? "red" : "grey"}`}>Wait</div>
      <div className={`pedestrian-light ${pedestrianState === "go" ? "green" : "grey"}`}>Go</div>
      <button onClick={switchState} disabled={pedestrianState === "wait"} className="btn btn-primary pedestrian-btn">
        Switch
      </button>
    </div>
  );
};

export default PedestrianTrafficLight;
