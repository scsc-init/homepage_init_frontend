"use client";

import { useState } from "react";
import TimeSlot from "./TimeSlot";
import styles from "./TimeGrid.module.css";

const daysOfWeek = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type TimeGridProps = {
  checkState: boolean[][]; // 68x7 boolean array
  changeState: React.Dispatch<React.SetStateAction<boolean[][]>>; // state setter function for 68x7 boolean array
};

const TimeGrid = ({ checkState, changeState }: TimeGridProps) => {
  const rows = 68; // for example, 07:00 ~24:00, total 17
  const columns = 7; // for example, 7 days
  const [isDragging, setIsDragging] = useState(false);
  const [dragColor, setDragColor] = useState("");

  const handleMouseDown = (color: string) => {
    setIsDragging(true);
    setDragColor(color);
  };

  const updateGridState = (
    color: string,
    curr_row: number,
    curr_col: number
  ) => {
    let newGrid = checkState.map((row) => row.slice());
    newGrid[curr_row][curr_col] = color === "green";
    changeState(newGrid);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const generateGrid = () => {
    let grid = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        row.push(
          <TimeSlot
            key={`${i}-${j}`}
            initialColor="pink"
            isDragging={isDragging}
            dragColor={dragColor}
            handleMouseDown={handleMouseDown}
            handleMouseEnter={() => {}}
            updateGridState={updateGridState}
            row={i}
            col={j}
          />
        );
      }
      grid.push(
        <div key={i} className={styles.row}>
          <span className={styles.time}>
            {i % 4 === 0 ? `${Math.floor(i / 4) + 7}:00` : ""}
          </span>
          {row}
        </div>
      );
    }
    return grid;
  };

  return (
    <div>
      <div className={styles.daysContainer}>
        {daysOfWeek.map((day) => (
          <span key={day} className={styles.day}>
            {day}
          </span>
        ))}
      </div>
      <div
        className={styles.grid}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {generateGrid()}
      </div>
    </div>
  );
};

export default TimeGrid;
