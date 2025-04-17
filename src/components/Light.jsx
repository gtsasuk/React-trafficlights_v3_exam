import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "../сss/Light.css";

const Light = ({ tlColor = "red", onClick, count, brightness = 1, blinkCount = 2, isActive = false }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  const handleClick = (e) => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 1000 * blinkCount);
    onClick(e); 
  };

  useEffect(() => {
    if (isActive) {
      setIsBlinking(true);
      const timeout = setTimeout(() => setIsBlinking(false), 1000 * blinkCount);
      return () => clearTimeout(timeout);
    }
  }, [isActive, blinkCount]);

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
  isActive: PropTypes.bool,
};

Light.defaultProps = {
  isActive: false,
};

export default Light;