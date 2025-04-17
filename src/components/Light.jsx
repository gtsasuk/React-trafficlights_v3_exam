import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useState } from "react";
import "../сss/Light.css";

const Light = ({ tlColor = "red", onClick, count, brightness = 1, blinkCount = 2 }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  const handleClick = (e) => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 1000 * blinkCount);
    onClick(e); 
  };

  return (
    <motion.div
      className="light"
      style={{ backgroundColor: tlColor, filter: `brightness(${brightness})` }}
      onClick={handleClick}
      animate={isBlinking ? { opacity: [1, 0.2, 1] } : {}}
      transition={{ duration: 1, repeat: blinkCount }}
    >
      <span>{count}</span>
    </motion.div>
  );
};

Light.propTypes = {
  tlColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  brightness: PropTypes.number.isRequired,
  blinkCount: PropTypes.number.isRequired,
};

export default Light;