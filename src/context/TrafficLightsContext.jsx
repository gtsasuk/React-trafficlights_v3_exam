import React, { createContext, useState, useEffect } from "react";

export const TrafficLightsContext = createContext();
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxbmKq8mPeFIOrN-e02iJG_tY7OmMyuxnUVmM4GyvEvf56hkA68HIvpbIQzsQhRuc8rWg/exec";
const API_BASE_URL = "https://traffic-lights-api.onrender.com";

const TrafficLightsProvider = ({ children }) => {
  const [orientation, setOrientation] = useState("vertical");
  const [clickCounts, setClickCounts] = useState([]);
  const [settings, setSettings] = useState({ brightness: 1, blinkCount: 2 });
  const [stateFromGoogle, setStateFromGoogle] = useState([]);
  const [pedestrianStateFromGoogle, setPedestrianStateFromGoogle] = useState([]);
  const [currentLightState, setCurrentLightState] = useState(null);

  const fetchTrafficLights = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/trafficLights`);
      const data = await res.json();
      setClickCounts(data?.[orientation] || []);
    } catch (error) {
      console.error("Помилка завантаження trafficLights:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      const data = await res.json();
      setSettings(data?.[orientation] || { brightness: 1, blinkCount: 2 });
    } catch (error) {
      console.error("Помилка завантаження settings:", error);
    }
  };

  const fetchGoogleState = async () => {
    try {
      const res = await fetch(`${GOOGLE_API_URL}?action=getStateByName&name=${orientation}`);
      const textData = await res.text();
      console.log("Received data:", textData);
      const jsonData = JSON.parse(textData);
      setStateFromGoogle(jsonData);
    } catch (error) {
      console.error("Error fetching state from Google Sheets:", error);
    }
  };

  const fetchPedestrianState = async () => {
    try {
      const res = await fetch(`${GOOGLE_API_URL}?action=getStateByName&name=${orientation}Pedestrian`);
      const textData = await res.text();
      console.log("Received pedestrian data:", textData);
      const jsonData = JSON.parse(textData);
      setPedestrianStateFromGoogle(jsonData);
    } catch (error) {
      console.error("Error fetching pedestrian state from Google Sheets:", error);
    }
  };

  useEffect(() => {
    fetchTrafficLights();
    fetchSettings();
    fetchGoogleState();
    fetchPedestrianState();
  }, [orientation]);

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === "vertical" ? "horizontal" : "vertical"));
  };

  const handleClick = (color, e) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedData = clickCounts.map((light) =>
      light.color === color ? { ...light, clickcount: light.clickcount + 1 } : light
    );
    setClickCounts(updatedData);
    console.log("Updated Data to send:", updatedData);
    fetch(`${API_BASE_URL}/trafficLights`)
      .then((res) => res.json())
      .then((allData) => {
        const updatedLights = {
          ...allData, 
          [orientation]: updatedData, 
        };

        return fetch(`${API_BASE_URL}/trafficLights`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedLights),
        });
      })
      .catch((error) => console.error("Помилка оновлення trafficLights:", error));

      const trafficLight = stateFromGoogle.find((light) => light.name.toLowerCase() === orientation.toLowerCase());

      if (trafficLight) {
        const newState = updatedData.find((light) => light.color === color)?.color;
    
        if (newState) {
          setCurrentLightState(newState);
    
          fetch(`${GOOGLE_API_URL}`, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({
              action: "updateState",
              id: trafficLight.id,
              state: newState,
            }),
            mode: "cors"
          })
            .then(() => {
              setStateFromGoogle((prevState) => 
                prevState.map((light) =>
                  light.id === trafficLight.id
                    ? { ...light, state: newState }
                    : light
                )
              );
            })
            .catch((error) => console.error("Error updating state in Google Sheets:", error));
          
        }
      }
      
  };

  const resetClickCounts = () => {
    const resetData = clickCounts.map((light) => ({ ...light, clickcount: 0 }));
    setClickCounts(resetData);
  
    fetch(`${API_BASE_URL}/trafficLights`)
      .then((res) => res.json())
      .then((allData) => {
        const updatedLights = { ...allData, [orientation]: resetData };
  
        return fetch(`${API_BASE_URL}/trafficLights`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedLights),
        });
      })
      .catch((error) => console.error("Помилка скидання trafficLights:", error));
  };

  const updateBrightness = (value) => {
    const updatedSettings = { ...settings, brightness: value };
    setSettings(updatedSettings);

    fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((allSettings) => {
        const updatedData = {
          ...allSettings,
          [orientation]: updatedSettings,
        };

        return fetch(`${API_BASE_URL}/settings`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
      })
      .catch((error) => console.error("Помилка оновлення settings:", error));
  };

  const updateBlinkCount = (value) => {
    const updatedSettings = { ...settings, blinkCount: value };
    setSettings(updatedSettings);

    fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((allSettings) => {
        const updatedData = {
          ...allSettings,
          [orientation]: updatedSettings,
        };

        return fetch(`${API_BASE_URL}/settings`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
      })
      .catch((error) => console.error("Помилка оновлення settings:", error));
  };

  const setTrafficLightState = (newState) => {
    const updatedData = clickCounts.map((light) =>
      light.color === newState
        ? { ...light, clickcount: light.clickcount + 1 }
        : light
    );
    setClickCounts(updatedData);
  
    const trafficLight = stateFromGoogle.find(
      (light) => light.name.toLowerCase() === orientation.toLowerCase()
    );
  
    if (trafficLight) {
      setCurrentLightState(newState);
  
      fetch(`${GOOGLE_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "updateState",
          id: trafficLight.id,
          state: newState,
        }),
        mode: "cors",
      })
        .then(() => {
          setStateFromGoogle((prevState) =>
            prevState.map((light) =>
              light.id === trafficLight.id ? { ...light, state: newState } : light
            )
          );
        })
        .catch((error) => console.error("Error updating state in Google Sheets:", error));
    }
  };

  return (
    <TrafficLightsContext.Provider
      value={{
        orientation,
        setOrientation,
        toggleOrientation,
        clickCounts,
        handleClick,
        settings,
        updateBrightness,
        updateBlinkCount,
        stateFromGoogle,
        currentLightState,
        resetClickCounts,
        setTrafficLightState,
        pedestrianStateFromGoogle 
      }}
    >
      {children}
    </TrafficLightsContext.Provider>
  );
};

export default TrafficLightsProvider;