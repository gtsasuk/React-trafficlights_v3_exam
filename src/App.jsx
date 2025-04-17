import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrafficLightsPage from "./components/TrafficLightsPage";
import Header from "./components/Header";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import TrafficLightsProvider from "./context/TrafficLightsContext";
import "./сss/App.css"

const App = () => {
  return (
    <TrafficLightsProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:orientation" element={<TrafficLightsPage />} /> 
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </TrafficLightsProvider>
  );
};

export default App;
