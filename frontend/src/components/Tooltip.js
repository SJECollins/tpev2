import React, { useState } from "react";
import styles from "../styles/Tooltip.module.css";

const Tooltip = ({ message, icon }) => {
  const [showTip, setShowTip] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <span
        style={showTip ? { visibility: "visible" } : {}}
        className={styles.Tooltip}
      >
        {message}
      </span>
      {icon && <span>{icon}</span>}
    </div>
  );
};

export default Tooltip;
