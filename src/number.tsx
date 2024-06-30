import { h } from 'preact';
import { useState } from 'preact/hooks';

interface NumberProps
{
  grid: boolean[][];
};

const Number = ({ grid }: NumberProps) =>
{
  const [numberResult, setNumberResult] = useState<string>("0000");
  /**
   * Object to store the information for decrypting visual pattern into a number following the game logic
   */
  const elements = {
    // 1 quadrant
    0: {
      "01": 1,
      "45": 2,
      "34": 3,
      "03": 4,
      "013": 5,
      "024": 6,
      "0124": 7,
      "0245": 8,
      "01245": 9,
    },
    // 3 quadrant
    1: {
      "45": 1,
      "01": 2,
      "03": 3,
      "34": 4,
      "345": 5,
      "024": 6,
      "0245": 7,
      "0124": 8,
      "01245": 9,
    },
    // 2 qadrant
    2: {
      "01": 1,
      "45": 2,
      "25": 3,
      "12": 4,
      "012": 5,
      "135": 6,
      "0135": 7,
      "1345": 8,
      "01345": 9,
    },
    // 4 quadrant
    3: {
      "45": 1,
      "01": 2,
      "12": 3,
      "25": 4,
      "245": 5,
      "135": 6,
      "1345": 7,
      "0135": 8,
      "01345": 9,
    },
  }
  /**
   * Array to store the number representation of the figure
   */
  const number: Int16Array = Int16Array.of(0, 0, 0, 0);

  /**
   * Function to drop central column and row
   * @param grid 
   * @returns 
   */
  const dropCentralColumnAndRow = (grid: boolean[][]): boolean[][] =>
  {
    // Create a new array with dropped column
    const modifiedGrid = grid.map(row => [[...row.slice(0, 2)], [...row.slice(3)]]);

    // Remove the third row
    modifiedGrid.splice(3, 1);

    return modifiedGrid.flat();
  };

  /**
   * Function to get the number representation of the quadrant clicked cells
   * @param quadrantNumbers 
   * @param index 
   * @returns 
   */
  const getNumberString = (quadrantNumbers: boolean[][], index: number) =>
  {
    return quadrantNumbers.flat()
      .map((value, index) => value ? index : null)
      .join('');
  };

  /**
   * Function to decrypt the figure to the number referencing game logic
   * @param numberString 
   * @param index 
   * @returns 
   */
  const decryptPattern = (numberString: string, index: number): number =>
  {
    return elements[index][numberString];
  };

  /**
   *  Function to insert the decrypted number in the correct position
   */
  const insertNumber = (value: any, index: number) =>
  {
    switch (index)
    {
      case 0:
        return number[2] = value;
      case 1:
        return number[0] = value;
      case 2:
        return number[3] = value;
      case 3:
        return number[1] = value;
    }
  }
  const separateIntoTwoGroups = (twoBigGroups: boolean[][][], row: boolean[], rowIndex: number): boolean[][][] =>
  {
    const quadrantIndex = rowIndex % 2; // Determine the quadrant index based on repeating pattern
    twoBigGroups[quadrantIndex].push(row); // Push the current row to the corresponding quadrant array
    return twoBigGroups;
  }
  const separateIntoQuadrants = (quadrants: boolean[][][], row: boolean[], rowIndex: number): boolean[][][] =>
  {
    const quadrantIndex = Math.floor(rowIndex / 3); // Determine the quadrant index based on repeating pattern
    quadrants[quadrantIndex].push(row); // Push the current row to the corresponding quadrant array
    return quadrants;
  }
  /**
   * Function to compose the number from the grid active cells
  */
  const composeNumber = () =>
  {
    dropCentralColumnAndRow(grid)
      .reduce(separateIntoTwoGroups, [[], []])
      .flat()
      .reduce(separateIntoQuadrants, [[], [], [], []])
      .flatMap(getNumberString)
      .map(decryptPattern)
      .forEach(insertNumber)
    setNumberResult(number.join(''));
  };
  return h(
    "div",
    {className: "number"},
    h(
      "button",
      { onClick: composeNumber },
      "Get number",
    ),
    h(
      "p",
      null,
      numberResult,
    ),
  );
}

export default Number;