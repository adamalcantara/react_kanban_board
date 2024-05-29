import PlusIcon from "../icons/PlusIcon";
import { useState } from "react";
// import the types column defined in its file
import { Column } from "../types";
import ColumnContainer from "./ColumnContainer";

function KanbanBoard() {
    // define columns and set columns and have them set to an empty array, using the type defined in the file
    const [columns, setColumns] = useState<Column[]>([]);
    console.log(columns);

  return (
    <div className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    ">
        <div className="m-auto flex gap-4">
            <div className="flex gap-4">{columns.map(col => (
                <ColumnContainer column={col}/>
            ))}
            </div>
            <button 
            onClick={() => {
                createNewColumn();
            }}
            className="
            h-[60px]
            w-[350px]
            min-w-[350px]
            cursor-pointer
            rounded-lg
            bg-mainBackgroundColor
            border-2
            border-columnBackgroundColor
            p-4
            ring-sky-500
            hover:ring-2
            flex
            gap-2
            ">
                <PlusIcon />
                Add Column</button>
        </div>
    </div>
  );

  function createNewColumn() {
    // define column to add and have it use the type of column
    const columnToAdd: Column = {
        // ID is defined by the generate ID function
        id: generateID(),
        title: `Column ${columns.length + 1}`
    }

    // set columns to all previous columns plus columns from columnToAdd function
    setColumns([...columns, columnToAdd]);
  }
}

// function to generate a random ID
function generateID() {
    return Math.floor(Math.random() * 10001);
}

export default KanbanBoard