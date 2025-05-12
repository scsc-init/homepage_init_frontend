"use client";

import { useState } from "react";
import styles from "./TimeSlot.module.css";

type TimeSlotProps = {
  initialColor: string;
  isDragging: boolean;
  dragColor: string;
  handleMouseDown: (color: string) => void;
  handleMouseEnter: (e: React.MouseEvent) => void;
  updateGridState: (color: string, row: number, col: number) => void;
  row: number;
  col: number;
};

const TimeSlot: React.FC<TimeSlotProps> = ({
  initialColor,
  isDragging,
  dragColor,
  handleMouseDown,
  handleMouseEnter,
  updateGridState,
  row,
  col,
}) => {
  const [color, setColor] = useState(initialColor);

  const handleMouseDownLocal = (e: React.MouseEvent) => {
    let newColor = color;
    if (e.button === 0) {
      newColor = "green";
    } else if (e.button === 2) {
      newColor = "pink";
    }
    setColor(newColor);
    updateGridState(newColor, row, col);
    handleMouseDown(newColor);
  };

  const handleMouseEnterWrapper = (e: React.MouseEvent) => {
    if (isDragging) {
      setColor(dragColor);
      updateGridState(dragColor, row, col);
    }
    handleMouseEnter(e);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={styles.timeSlot}
      style={{ backgroundColor: color }}
      onMouseDown={handleMouseDownLocal}
      onMouseEnter={handleMouseEnterWrapper}
      onContextMenu={handleContextMenu}
    />
  );
};

export default TimeSlot;
