import { h } from 'preact';

interface CellProps {
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
  isConnected: boolean;
}

const Cell = ({ row, col, onClick, isConnected }: CellProps) =>
{
  return h(
    "div",
    {
      className: `cell ${isConnected ? 'connected' : ''}`,
      onClick: () => onClick(row, col)
    },
  );
}

export default Cell;