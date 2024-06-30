import { h } from 'preact';
import Cell from './cell';

interface GridProps {
  grid: boolean[][];
  callback: (grid: boolean[][]) => void;
}

const Grid = ({ grid, callback }: GridProps) =>
{
  // Function to handle click on a cell
  const handleCellClick = (row, col) =>
  {
    // Toggle the isConnected state of the clicked cell
    const updatedGrid = grid.map((rowArray, rowIndex) =>
      rowArray.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? !cell : cell
      )
    );
    callback(updatedGrid);
  };

  return h(
    "div",
    { className: "grid" },
    grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => h(
        Cell,
        {
          key: `${rowIndex}-${colIndex}`,
          row: rowIndex,
          col: colIndex,
          onClick: handleCellClick,
          isConnected: cell
        }
      ))
    ),
  );

};

export default Grid;