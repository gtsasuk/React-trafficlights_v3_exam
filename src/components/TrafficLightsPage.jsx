import { useEffect, useContext } from "react";
import { TrafficLightsContext } from "../context/TrafficLightsContext";
import { useParams } from "react-router-dom";
import TrafficLights from "../components/TrafficLights";
import PedestrianTrafficLight from "../components/PedestrianTrafficLight";
import StatsBar from "../components/StatsBar";

const TrafficLightsPage = () => {
    const { orientation } = useParams(); 
    const { setOrientation } = useContext(TrafficLightsContext);
  
    useEffect(() => {
      setOrientation(orientation); 
    }, [orientation, setOrientation]);
  
    return (
      <div className="app-container">
        <h1 className="title">{orientation === "vertical" ? "Vertical" : "Horizontal"} Traffic Lights</h1>
        <TrafficLights />
        <PedestrianTrafficLight /> 
        <StatsBar />
      </div>
    );
  };
  
  export default TrafficLightsPage;