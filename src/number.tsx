import { h } from 'preact';
import { useState } from 'preact/hooks';

const _pipe = (a, b) => (arg) => b(a(arg));
const pipe = (...ops) => ops.reduce(_pipe);

interface NumberProps
{
  grid: boolean[][];
  setGrid: (grid: boolean[][]) => void;
};

const Number = ({ grid, setGrid }: NumberProps) =>
{
  const [numberPattern, setPatternNumber] = useState<string>("");

  const getNumber = () => numberPattern;
  /**
   * Object to store the information for decrypting visual pattern into a number following the game logic
   */
  const elements: { [key: number]: { [key: string]: number } } = {
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
  const parseGridToNumber = () =>
  {
    dropCentralColumnAndRow(grid)
      .reduce(separateIntoTwoGroups, [[], []])
      .flat()
      .reduce(separateIntoQuadrants, [[], [], [], []])
      .flatMap(getNumberString)
      .map(decryptPattern)
      .forEach(insertNumber)
    setPatternNumber(number.join(''));
  };

  const quadrantFromString = (quadrant: string): boolean[] =>
  {
    const quadrantArray = [false, false, false, false, false, false];
    quadrant.split("")
      .forEach((value) => quadrantArray[value] = true);
    return quadrantArray;
  }

  const reduceIntoArraysBy2 = (quadrant: boolean[]): boolean[][] =>
  {
    return quadrant.reduce((result: any[][], item: any, index: number) =>
    {
      const chunkIndex = Math.floor(index / 2);
      if (!result[chunkIndex])
      {
        result[chunkIndex] = []; // Initialize inner array if it doesn't exist
      }
      result[chunkIndex].push(item);
      return result;
    },
      []);
  }

  const splitEachSymbol = (str: string) => str.split("");

  const arrangeNumber = (layout: number[]) => (number: string[]) =>
  {
    const rearranged = [0, 0, 0, 0];
    number.forEach((value, index) => rearranged[layout[index]] = parseInt(value));
    return rearranged;
  }

  const getKeyByValue = (mapObject: any) => (value: any, index: number) =>
  {
    return Object.entries(mapObject[index]).find((entrie) => entrie[1] === value)[0]
  }

  const getPatternByDigit = getKeyByValue(elements)

  const mapDigitsToQuadrantPattern = (digits: number[]): string[] =>
  {
    return digits.map(getPatternByDigit)
  }

  const mapQuadrantFromString = (stringArray: string[]): boolean[][] => stringArray.map(quadrantFromString);

  const mapReduceArrayBy2 = (inputArray: boolean[][]): boolean[][][] => inputArray.map(reduceIntoArraysBy2);

  const reduceIntoTwoGroups = (inputArray) => inputArray.reduce(separateIntoTwoGroups, [[], []])

  const composeGridFromArrays = (inputArray: boolean[][][]) =>
  {
    let gridTemp = [];
    for (let group = 0; group <= 1; group++)
    {
      for (let line = 0; line <= 2; line++)
      {
        let lineArray = [];
        // 0,1 because we splited 4 quadrants into 2 groups
        for (let quadrant = 0; quadrant <= 1; quadrant++)
        {
          lineArray.push(inputArray[group][quadrant][line])
        }
        gridTemp.push(lineArray.flat())
      }
    }
    return gridTemp;
  }

  const insertCentralRowAndColumns = (grid: boolean[][]): boolean[][] =>
  {
    // Clone the grid to avoid mutating the original array
    const restoredGrid = grid.map(row => [...row]);

    // Insert a new row at index 3 (fourth row)
    const newEmptyRow = Array(restoredGrid[0].length).fill(false); // Create a new row with false values
    restoredGrid.splice(3, 0, newEmptyRow);

    // Insert a new column at index 2 (third column)
    for (let i = 0; i < restoredGrid.length; i++)
    {
      restoredGrid[i].splice(2, 0, true); // Insert false (or default value) for each row
    }

    return restoredGrid;
  };


  const parseNumberToGrid = pipe(
    getNumber,
    splitEachSymbol,
    arrangeNumber([1, 3, 0, 2]),
    mapDigitsToQuadrantPattern,
    mapQuadrantFromString,
    mapReduceArrayBy2,
    reduceIntoTwoGroups,
    composeGridFromArrays,
    insertCentralRowAndColumns,
    setGrid,
  );

  const handleInputNumber = (event) => setPatternNumber(event.target.value)

  return h(
    "div",
    { className: "number" },
    h(
      "button",
      { onClick: parseGridToNumber },
      "To number",
    ),
    h(
      "input",
      {
        type: "number",
        style: "width: 140px",
        value: numberPattern,
        onInput: handleInputNumber
      },
    ),
    h(
      "button",
      { onClick: parseNumberToGrid },
      "To pattern",
    ),
  );
}

export default Number;