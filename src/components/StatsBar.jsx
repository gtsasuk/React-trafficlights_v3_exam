import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TrafficLightsContext } from "../context/TrafficLightsContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faLeftRight, faUpDown } from '@fortawesome/free-solid-svg-icons';
import "../сss/StatsBar.css"

const StatsBar = () => {
  const { clickCounts, toggleOrientation, orientation, settings, updateBlinkCount, updateBrightness, stateFromGoogle, resetClickCounts  } = useContext(TrafficLightsContext);
  const navigate = useNavigate();

  const handleToggle = () => {
    const newOrientation = orientation === "vertical" ? "horizontal" : "vertical";
    toggleOrientation(); 
    setTimeout(() => navigate((`/${newOrientation}`), 0)); 
  };

  return (
    <div className="stats-bar border-[1px] shadow bg-slate-300">
      <button type="button" onClick={handleToggle} className="btn btn-primary toggle-btn">Toggle Orientation <FontAwesomeIcon icon={orientation === 'vertical' ? faLeftRight : faUpDown} /></button>
      <button type="button" onClick={resetClickCounts} className="btn btn-error mt-2 text-white text-[18px] rounded-[15px]">Reset Clicks <FontAwesomeIcon icon={faRotateRight} /></button>
      <h3>Click Stats:</h3>
      <ul>
        {clickCounts.map((light) => (
          <li key={light.id}>{light.color} - {light.clickcount} clicks</li>
        ))}
      </ul>

      <ul>
        <li>
          <label>Brightness: </label>
          <button className="btn btn-primary btn-stats" onClick={() => updateBrightness(Math.max(0.01, settings.brightness - 0.01))}>-</button>
          <span>{Math.round(settings.brightness * 100)}%</span>
          <button className="btn btn-primary btn-stats" onClick={() => updateBrightness(Math.min(1, settings.brightness + 0.01))}>+</button>
        </li>
        <li>
          <label>Blink count: </label>
          <button className="btn btn-primary btn-stats" onClick={() => updateBlinkCount(Math.max(1, settings.blinkCount - 1))}>-</button>
          <span>{settings.blinkCount}</span>
          <button className="btn btn-primary btn-stats" onClick={() => updateBlinkCount(settings.blinkCount + 1)}>+</button>
        </li>
      </ul>

      <p>Current State of Selected Traffic Light:</p>
      <ul>
        {stateFromGoogle.map((light) => (
          <li key={light.id}>
            {light.name}: {light.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsBar;