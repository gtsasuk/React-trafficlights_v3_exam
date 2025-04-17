import React, { createContext, useState, useEffect } from "react";

export const TrafficLightsContext = createContext();
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxbmKq8mPeFIOrN-e02iJG_tY7OmMyuxnUVmM4GyvEvf56hkA68HIvpbIQzsQhRuc8rWg/exec";
const API_BASE_URL = "https://traffic-lights-api.onrender.com";

const TrafficLightsProvider = ({ children }) => {
  const [orientation, setOrientation] = useState("vertical");
  const [clickCounts, setClickCounts] = useState([]);
  const [settings, setSettings] = useState({ brightness: 1, blinkCount: 2 });
  const [stateFromGoogle, setStateFromGoogle] = useState([]);
  const [currentLightState, setCurrentLightState] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/trafficLights`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.[orientation]) {
          setClickCounts(data[orientation]);
        } else {
          setClickCounts([]);
        }
      })
      .catch((error) =>
        console.error("Помилка завантаження trafficLights:", error)
      );

      fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.[orientation]) {
          setSettings(data[orientation]);
        } else {
          setSettings({ brightness: 1, blinkCount: 2 });
        }
      })
      .catch((error) => console.error("Помилка завантаження settings:", error));

      fetch(`${GOOGLE_API_URL}?action=getStateByName&name=${orientation}`, {
        method: "GET",
      })
        .then((res) => res.text()) 
        .then((data) => {
          console.log("Received data:", data);
          try {
            const jsonData = JSON.parse(data);
            setStateFromGoogle(jsonData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        })
        .catch((error) => console.error("Error fetching state from Google Sheets:", error));
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
        setTrafficLightState
      }}
    >
      {children}
    </TrafficLightsContext.Provider>
  );
};

export default TrafficLightsProvider;